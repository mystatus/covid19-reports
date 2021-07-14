import csv from 'csvtojson';
import { Response } from 'express';
import fs from 'fs';
import moment from 'moment';
import {
  getConnection,
  getManager,
  In,
  OrderByCondition,
  SelectQueryBuilder,
} from 'typeorm';
import {
  assertRequestBody,
  assertRequestParams,
} from '../../util/api-utils';
import {
  BadRequestError,
  CsvRowError,
  NotFoundError,
  RosterUploadError,
  UnprocessableEntity,
} from '../../util/error-types';
import {
  addRosterEntry,
  editRosterEntry,
} from '../../util/roster-utils';
import { getDatabaseErrorMessage } from '../../util/typeorm-utils';
import {
  dateFromString,
  getMissingKeys,
} from '../../util/util';
import {
  ApiRequest,
  EdipiParam,
  OrgColumnParams,
  OrgParam,
  OrgRosterParams,
  Paginated,
  PaginatedQuery,
} from '../api.router';
import { Org } from '../org/org.model';
import { Unit } from '../unit/unit.model';
import { UserRole } from '../user/user-role.model';
import {
  CustomColumnData,
  CustomRosterColumn,
} from './custom-roster-column.model';
import {
  ChangeType,
  RosterHistory,
} from './roster-history.model';
import { Roster } from './roster.model';
import {
  RosterColumnValue,
  RosterColumnInfo,
  RosterColumnType,
  RosterEntryData,
  unitColumnDisplayName,
  edipiColumnDisplayName,
  RosterFileRow,
} from './roster.types';

class RosterController {

  async addCustomColumn(req: ApiRequest<OrgParam, AddCustomColumnBody>, res: Response) {
    assertRequestBody(req, [
      'displayName',
      'type',
    ]);

    const column = new CustomRosterColumn();
    column.org = req.appOrg;
    column.setFromData(req.body);
    await column.save();

    res.status(201).json(column);
  }

  async updateCustomColumn(req: ApiRequest<OrgColumnParams, CustomColumnData>, res: Response) {
    const existingColumn = await CustomRosterColumn.findOne({
      relations: ['org'],
      where: {
        name: req.params.columnName,
        org: req.appOrg!.id,
      },
    });

    if (!existingColumn) {
      throw new NotFoundError('The roster column could not be found.');
    }

    existingColumn.setFromData(req.body);
    await existingColumn.save();

    res.json(existingColumn);
  }

  async deleteCustomColumn(req: ApiRequest<OrgColumnParams>, res: Response) {
    const existingColumn = await CustomRosterColumn.findOne({
      relations: ['org'],
      where: {
        name: req.params.columnName,
        org: req.appOrg!.id,
      },
    });

    if (!existingColumn) {
      throw new NotFoundError('The roster column could not be found.');
    }

    await existingColumn.remove();

    res.json(existingColumn);
  }

  async getRosterTemplate(req: ApiRequest, res: Response) {
    const columns = await Roster.getAllowedColumns(req.appOrg!, req.appUserRole!.role);
    const headers: string[] = ['Unit'];
    const example: string[] = ['unit1'];
    columns.forEach(column => {
      if (column.name === 'edipi') {
        headers.push('DoD ID');
        example.push('0000000001');
      } else {
        headers.push(column.displayName.includes('"') ? `"${column.displayName.replaceAll('"', '\\"')}"` : column.displayName);
        switch (column.type) {
          case RosterColumnType.Number:
            example.push('12345');
            break;
          case RosterColumnType.Boolean:
            example.push('false');
            break;
          case RosterColumnType.String:
            example.push('Example Text');
            break;
          case RosterColumnType.Date:
            example.push(new Date().toISOString().split('T')[0]);
            break;
          case RosterColumnType.DateTime:
            example.push(new Date().toISOString());
            break;
          default:
            example.push('');
            break;
        }
      }
    });
    const csvContents = `${headers.join(',')}\n${example.join(',')}`;
    res.header('Content-Type', 'text/csv');
    res.attachment('roster-template.csv');
    res.send(csvContents);
  }

  async getRoster(req: ApiRequest<OrgParam, any, GetRosterQuery>, res: Response<Paginated<RosterEntryData>>) {
    res.json(await internalSearchRoster(req.query, req.appOrg!, req.appUserRole!));
  }

  async searchRoster(req: ApiRequest<OrgParam, SearchRosterBody, GetRosterQuery>, res: Response<Paginated<RosterEntryData>>) {
    res.json(await internalSearchRoster(req.query, req.appOrg!, req.appUserRole!, req.body));
  }

  async uploadRosterEntries(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.file || !req.file.path) {
      throw new BadRequestError('No file to process.');
    }

    let rosterCsvRows: RosterFileRow[];
    try {
      rosterCsvRows = await csv().fromFile(req.file.path) as RosterFileRow[];
    } catch (err) {
      throw new UnprocessableEntity('Roster file was unable to be processed. Check that it is formatted correctly.');
    } finally {
      fs.unlinkSync(req.file.path);
    }

    if (rosterCsvRows.length === 0) {
      res.json({ count: 0 });
      return;
    }

    const orgUnits = await req.appUserRole?.getUnits();
    if (!orgUnits) {
      throw new BadRequestError('No units found.');
    }

    const columns = await Roster.getAllowedColumns(req.appOrg!, req.appUserRole!.role);

    const requiredColumns = columns
      .filter(x => x.required)
      .map(x => x.displayName)
      .concat([unitColumnDisplayName]);

    const missingRequiredColumns = getMissingKeys(rosterCsvRows[0], requiredColumns);
    if (missingRequiredColumns.length > 0) {
      throw new BadRequestError(`Missing required column(s): ${missingRequiredColumns.map(x => `"${x}"`).join(', ')}`);
    }

    const existingEntries = await Roster.find({
      relations: ['unit', 'unit.org'],
      where: {
        edipi: In(rosterCsvRows.map(x => x[edipiColumnDisplayName])),
      },
    });

    // Start a transaction with the query runner so that we can rollback/commit manually.
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    const rowErrors: CsvRowError[] = [];
    let savedCount = 0;
    for (let rowIndex = 0; rowIndex < rosterCsvRows.length; rowIndex++) {
      const csvRow = rosterCsvRows[rowIndex];

      // Try to get a roster entry from the row.
      let entry: Roster;
      try {
        entry = getRosterEntryFromCsvRow(csvRow, columns, rowIndex, orgUnits, existingEntries);
      } catch (err) {
        if (err instanceof CsvRowError) {
          rowErrors.push(err);
        } else {
          rowErrors.push(new CsvRowError(err, csvRow, rowIndex));
        }
        continue;
      }

      // Try to save the roster entry.
      try {
        await manager.save(entry);
        savedCount += 1;
      } catch (err) {
        const message = getDatabaseErrorMessage(err);
        rowErrors.push(new CsvRowError(message, csvRow, rowIndex));
      }
    }

    if (rowErrors.length > 0) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new RosterUploadError(rowErrors);
    }

    await queryRunner.commitTransaction();
    await queryRunner.release();

    res.json({ count: savedCount });
  }

  async deleteRosterEntries(req: ApiRequest, res: Response) {
    const units = await req.appUserRole!.getUnits();
    for (const unit of units) {
      await Roster.delete({
        unit,
      });
    }
    res.status(200).send();
  }

  async getFullRosterInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await Roster.getColumns(req.appOrg!.id);
    res.json(columns);
  }

  async getRosterInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await Roster.getAllowedColumns(req.appOrg!, req.appUserRole!.role);
    res.json(columns);
  }

  async getRosterInfosForIndividual(req: ApiRequest<EdipiParam, null, ReportDateQuery>, res: Response) {

    res.json({
      rosters: await getRosterInfosForIndividualOnDate(req.params.edipi, req.query.reportDate),
    });
  }

  async addRosterEntry(req: ApiRequest<OrgParam, RosterEntryData>, res: Response) {
    const newRosterEntry = await getManager().transaction(async manager => {
      return addRosterEntry(req.appOrg!, req.appUserRole!.role, req.body, manager);
    });
    res.status(201).json(newRosterEntry);
  }

  async getRosterEntry(req: ApiRequest<OrgRosterParams>, res: Response) {
    const rosterId = req.params.rosterId;

    const queryBuilder = await Roster.queryAllowedRoster(req.appOrg!, req.appUserRole!);
    const rosterEntry = await queryBuilder
      .andWhere('roster.id = :rosterId', { rosterId })
      .getRawOne<RosterEntryData>();

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    res.json(rosterEntry);
  }

  async deleteRosterEntry(req: ApiRequest<OrgRosterParams>, res: Response) {
    const rosterId = req.params.rosterId;

    const rosterEntry = await Roster.findOne({
      relations: ['unit'],
      where: {
        id: rosterId,
      },
    });

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    const deletedEntry = await rosterEntry.remove();

    res.json(deletedEntry);
  }

  async updateRosterEntry(req: ApiRequest<OrgRosterParams, RosterEntryData>, res: Response) {
    assertRequestParams(req, ['rosterId']);
    const entryId = +req.params.rosterId;

    const entry = await getManager().transaction(async manager => {
      return editRosterEntry(req.appOrg!, req.appUserRole!, entryId, req.body, manager);
    });

    res.json(entry);
  }

}

export async function getRosterInfosForIndividualOnDate(edipi: string, dateStr: string) {
  const reportDate = dateFromString(dateStr);

  if (!reportDate) {
    throw new BadRequestError('Missing reportDate.');
  }
  const timestamp = reportDate.getTime() / 1000;
  const entries = await RosterHistory.createQueryBuilder('roster')
    .leftJoinAndSelect('roster.unit', 'unit')
    .leftJoinAndSelect('unit.org', 'org')
    .where('roster.edipi = :edipi', { edipi })
    .andWhere(`roster.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp })
    .select()
    .distinctOn(['roster.unit_id'])
    .orderBy('roster.unit_id')
    .addOrderBy('roster.timestamp', 'DESC')
    .addOrderBy('roster.change_type', 'DESC')
    .getMany();

  const responseData: RosterInfo[] = [];
  for (const roster of entries) {
    if (roster.changeType === ChangeType.Deleted) {
      continue;
    }

    const columns = (await Roster.getColumns(roster.unit.org!.id)).map(column => ({
      ...column,
      value: roster.getColumnValue(column),
    } as RosterColumnInfoWithValue));

    const rosterInfo: RosterInfo = {
      unit: roster.unit,
      columns,
    };
    responseData.push(rosterInfo);
  }
  return responseData;
}

const formatValue = (val: RosterColumnValue, column: RosterColumnInfo) => {
  if (val === null) {
    return val;
  }
  switch (column.type) {
    case RosterColumnType.String:
      return val.toString().toLowerCase();
    case RosterColumnType.DateTime:
      return `'${moment.utc(val.toString()).format('YYYY-MM-DD HH:mm')}:00.000000'`;
    case RosterColumnType.Date:
      return `'${moment.utc(val.toString()).format('YYYY-MM-DD')} 00:00:00.000000'`;
    default:
      return val;
  }
};

const formatColumnSelect = (column: RosterColumnInfo) => {
  const columnSelect = Roster.getColumnSelect(column);

  switch (column.type) {
    case RosterColumnType.String:
      return `LOWER(${columnSelect})`;
    case RosterColumnType.DateTime:
      return `date_trunc('minute', (${columnSelect})::TIMESTAMP)`;
    case RosterColumnType.Date:
      return `date_trunc('day', (${columnSelect})::TIMESTAMP)`;
    default:
      return columnSelect;
  }
};

function applyWhere(queryBuilder: SelectQueryBuilder<Roster>, column: RosterColumnInfo, {
  op,
  value,
}: SearchRosterBodyEntry) {
  const columnSelect = formatColumnSelect(column);

  if (op === 'in') {
    if (!Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected array value for ${column.name}.`);
    }
    return queryBuilder.andWhere(`${columnSelect} ${op} (:...${column.name})`, {
      [column.name]: value.map(v => formatValue(v, column)),
    });
  }

  if (op === 'between') {
    const maxKey = `${column.name}Max`;
    const minKey = `${column.name}Min`;
    if (!Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected array value for ${column.name}.`);
    }
    return queryBuilder.andWhere(`${columnSelect} BETWEEN (:${minKey}) AND (:${maxKey})`, {
      [minKey]: formatValue(value[0], column),
      [maxKey]: formatValue(value[1], column),
    });
  }

  if (op === '~' || op === 'startsWith' || op === 'endsWith') {
    if (column.type !== RosterColumnType.String) {
      throw new BadRequestError('Malformed search query. Expected string value.');
    }
    const prefix = op !== 'startsWith' ? '%' : '';
    const suffix = op !== 'endsWith' ? '%' : '';
    return queryBuilder.andWhere(`${columnSelect} LIKE :${column.name}`, {
      [column.name]: `${prefix}${value}${suffix}`.toLowerCase(),
    });
  }

  if (op === '=' || op === '<>' || op === '>' || op === '<') {
    if (Array.isArray(value)) {
      throw new BadRequestError(`Malformed search query. Expected scalar value for ${column.name}.`);
    }
    return queryBuilder.andWhere(`${columnSelect} ${op} :${column.name}`, {
      [column.name]: formatValue(value, column),
    });
  }

  throw new BadRequestError(`Malformed search query. Received unexpected parameters for '${column.name}', op: ${op}`);
}

function findColumnByName(name: string, columns: RosterColumnInfo[]): RosterColumnInfo {
  if (name === 'unit') {
    return {
      name: 'unit',
      displayName: 'Unit',
      custom: false,
      phi: false,
      pii: false,
      type: RosterColumnType.Number,
      updatable: false,
      required: false,
    };
  }
  const column = columns.find(col => col.name === name);
  if (!column) {
    throw new BadRequestError(`Malformed search query. Unknown column name: '${name}'.`);
  }
  return column;
}

async function internalSearchRoster(query: GetRosterQuery, org: Org, userRole: UserRole, searchParams?: SearchRosterBody): Promise<Paginated<RosterEntryData>> {
  const limit = parseInt(query.limit ?? '100');
  const page = parseInt(query.page ?? '0');
  const orderBy = query.orderBy || 'edipi';
  const sortDirection = query.sortDirection || 'ASC';
  const rosterColumns = await Roster.getAllowedColumns(org, userRole.role);
  let queryBuilder = await Roster.queryAllowedRoster(org, userRole);

  if (searchParams) {
    Object.keys(searchParams)
      .forEach(columnName => {
        queryBuilder = applyWhere(queryBuilder, findColumnByName(columnName, rosterColumns), searchParams[columnName]);
      });
  }

  const rosterQuery = queryBuilder
    .clone()
    .offset(page * limit)
    .limit(limit);
  const sortColumn = rosterColumns.find(column => column.name === orderBy);
  if (sortColumn) {
    const order: OrderByCondition = {};
    order[Roster.getColumnSelect(sortColumn)] = sortDirection;
    rosterQuery.orderBy(order);
  } else if (orderBy === 'unit') {
    const order: OrderByCondition = {};
    order['u.name'] = sortDirection;
    rosterQuery.orderBy(order);
  }
  const roster = await rosterQuery.getRawMany<RosterEntryData>();

  const totalRowsCount = await queryBuilder.getCount();

  return {
    rows: roster,
    totalRowsCount,
  };
}

function getRosterEntryFromCsvRow(csvRow: RosterFileRow, columns: RosterColumnInfo[], rowIndex: number, orgUnits: Unit[], existingEntries: Roster[]) {
  const unitName = csvRow.Unit;
  if (!unitName) {
    throw new CsvRowError('"Unit" is required.', csvRow, rowIndex, unitColumnDisplayName);
  }

  const units = orgUnits.filter(u => unitName === u.name);
  if (units.length === 0) {
    throw new CsvRowError(`Unit "${(csvRow.unit ?? csvRow.Unit)}" could not be found in the group.`, csvRow, rowIndex, unitColumnDisplayName);
  }

  const edipi = csvRow[edipiColumnDisplayName];
  const unit = units[0];
  if (existingEntries.some(x => x.edipi === edipi && x.unit.org!.id === unit!.org!.id)) {
    throw new CsvRowError(`Entry with ${edipiColumnDisplayName} ${edipi} already exists.`, csvRow, rowIndex, edipiColumnDisplayName);
  }

  // Create a new roster entry and set its columns from the csv row.
  const entry = new Roster();
  entry.unit = unit;
  for (const column of columns) {
    try {
      entry.setColumnValueFromFileRow(column, csvRow);
    } catch (err) {
      throw new CsvRowError(err, csvRow, rowIndex, column.displayName);
    }
  }

  return entry;
}

interface RosterColumnInfoWithValue extends RosterColumnInfo {
  value: RosterColumnValue,
}

export interface RosterInfo {
  unit: Unit,
  columns: RosterColumnInfo[],
}

type GetRosterQuery = {
  orderBy?: string
  sortDirection?: 'ASC' | 'DESC'
} & PaginatedQuery;

type QueryOp = '=' | '<>' | '~' | '>' | '<' | 'startsWith' | 'endsWith' | 'in' | 'between';

type SearchRosterBodyEntry = {
  op: QueryOp
  value: RosterColumnValue | RosterColumnValue[]
};

type SearchRosterBody = {
  [column: string]: SearchRosterBodyEntry
};

type ReportDateQuery = {
  reportDate: string
};

type AddCustomColumnBody = CustomColumnData & Required<Pick<CustomColumnData, 'displayName' | 'type'>>;

export default new RosterController();
