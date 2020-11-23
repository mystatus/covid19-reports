import { Response } from 'express';
import csv from 'csvtojson';
import fs from 'fs';
import { snakeCase } from 'typeorm/util/StringUtils';
import {
  ApiRequest, EdipiParam, OrgColumnNameParams, OrgParam, OrgRosterParams, PagedQuery,
} from '../index';
import {
  baseRosterColumns, CustomColumnValue, Roster, RosterColumnInfo, RosterColumnType,
} from './roster.model';
import {
  BadRequestError, InternalServerError, NotFoundError, UnprocessableEntity,
} from '../../util/error-types';
import { BaseType, getOptionalParam, getRequiredParam } from '../../util/util';
import { Org } from '../org/org.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { Role } from '../role/role.model';
import { Unit } from '../unit/unit.model';

class RosterController {

  async addCustomColumn(req: ApiRequest<OrgParam, CustomColumnData>, res: Response) {
    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a new column.');
    }
    if (!req.body.displayName) {
      throw new BadRequestError('A display name must be supplied when adding a new column.');
    }
    if (!req.body.type) {
      throw new BadRequestError('A type must be supplied when adding a new column.');
    }

    const columnName = req.body.name;
    const existingColumn = await CustomRosterColumn.findOne({
      where: {
        name: columnName,
        org: req.appOrg!.id,
      },
    });

    if (existingColumn
      || columnName.toLowerCase() === 'unit'
      || baseRosterColumns.find(column => column.name.toLowerCase() === columnName.toLowerCase())) {
      throw new BadRequestError('There is already a column with that name.');
    }

    const column = new CustomRosterColumn();
    column.org = req.appOrg;
    setCustomColumnFromBody(column, req.body);

    const newColumn = await column.save();
    res.status(201).json(newColumn);
  }

  async updateCustomColumn(req: ApiRequest<OrgColumnNameParams, CustomColumnData>, res: Response) {
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

    if (req.body.name && req.body.name !== req.params.columnName) {
      throw new BadRequestError('Unable to change the field name of a custom column.');
    }

    setCustomColumnFromBody(existingColumn, req.body);
    const updatedColumn = await existingColumn.save();

    res.json(updatedColumn);
  }

  async deleteCustomColumn(req: ApiRequest<OrgColumnNameParams, CustomColumnData>, res: Response) {
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

    const deletedColumn = await existingColumn.remove();
    res.json(deletedColumn);
  }

  async exportRosterToCSV(req: ApiRequest, res: Response) {

    const orgId = req.appOrg!.id;

    const queryBuilder = await queryAllowedRoster(req.appOrg!, req.appRole!);
    const rosterData = await queryBuilder
      .orderBy({
        edipi: 'ASC',
      })
      .getRawMany<RosterEntryData>();

    // convert data to csv format and download
    const jsonToCsvConverter = require('json-2-csv');
    jsonToCsvConverter.json2csv(rosterData, (err: Error, csvString: String) => {
      // on failure
      if (err) {
        console.error('Failed to convert roster json data to CSV string.');
        throw new InternalServerError('Failed to export Roster data to CSV.');
      } else {
        // on success
        const date = new Date().toISOString();
        const filename = `org_${orgId}_roster_export_${date}.csv`;
        res.header('Content-Type', 'text/csv');
        res.attachment(filename);
        res.send(csvString);
      }
    });

  }

  async getRosterTemplate(req: ApiRequest, res: Response) {
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    const headers: string[] = ['unit'];
    const example: string[] = ['unit1'];
    columns.forEach(column => {
      headers.push(column.name);
      if (column.name === 'edipi') {
        example.push('0000000001');
      } else {
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
            example.push(new Date().toLocaleDateString());
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

  async getRoster(req: ApiRequest<OrgParam, any, PagedQuery>, res: Response) {
    const limit = (req.query.limit != null) ? parseInt(req.query.limit) : 100;
    const page = (req.query.page != null) ? parseInt(req.query.page) : 0;

    const queryBuilder = await queryAllowedRoster(req.appOrg!, req.appRole!);
    const roster = await queryBuilder
      .skip(page * limit)
      .take(limit)
      .orderBy({
        edipi: 'ASC',
      })
      .getRawMany<RosterEntryData>();

    const totalRowsCount = await (await queryAllowedRoster(req.appOrg!, req.appRole!)).getCount();

    res.json({
      rows: roster,
      totalRowsCount,
    });
  }

  async uploadRosterEntries(req: ApiRequest<OrgParam>, res: Response) {
    const org = req.appOrg!;

    if (!req.file || !req.file.path) {
      throw new BadRequestError('No file to process.');
    }

    const rosterEntries: Roster[] = [];
    let roster: RosterFileRow[];
    try {
      roster = await csv().fromFile(req.file.path) as RosterFileRow[];
    } catch (err) {
      throw new UnprocessableEntity('Roster file was unable to be processed. Check that it is formatted correctly.');
    } finally {
      fs.unlinkSync(req.file.path);
    }

    const orgUnits = await Unit.find({
      relations: ['org'],
      where: {
        org: org.id,
      },
    });

    const columns = await getAllowedRosterColumns(org, req.appRole!);
    roster.forEach(row => {
      if (!row.unit) {
        throw new BadRequestError('Unable to add roster entries without a unit ID.');
      }
      const unit = orgUnits.find(u => row.unit === u.id);
      if (!unit) {
        throw new NotFoundError(`Unit with ID ${row.unit} could not be found in the group.`);
      }
      const entry = new Roster();
      entry.unit = unit;
      for (const column of columns) {
        getColumnFromCSV(entry, row, column);
      }
      rosterEntries.push(entry);
    });
    await Roster.save(rosterEntries);

    res.json({
      count: rosterEntries.length,
    });
  }

  async getFullRosterInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await getRosterColumns(req.appOrg!.id);
    res.json(columns);
  }

  async getRosterInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    res.json(columns);
  }

  async getRosterInfosForIndividual(req: ApiRequest<EdipiParam, null, ReportDateQuery>, res: Response) {
    const reportDate = dateFromString(req.query.reportDate);
    if (!reportDate) {
      throw new BadRequestError('Missing reportDate.');
    }
    const entries = (await Roster.find({
      relations: ['unit', 'unit.org'],
      where: {
        edipi: req.params.edipi,
      },
    })).filter(entry => isActiveOnRoster(entry, reportDate));

    const responseData: RosterInfo[] = [];
    for (const roster of entries) {
      const columns = (await getRosterColumns(roster.unit.org!.id)).map(column => ({
        ...column,
        value: roster.getColumnValue(column),
      } as RosterColumnWithValue));

      const rosterInfo: RosterInfo = {
        unit: roster.unit,
        id: roster.id,
        columns,
      };
      responseData.push(rosterInfo);
    }

    res.json({
      rosters: responseData,
    });
  }

  async addRosterEntry(req: ApiRequest<OrgParam, RosterEntryData>, res: Response) {
    const edipi = req.body.edipi as string;
    const rosterEntries = await Roster.find({
      relations: ['unit'],
      where: (qb: any) => {
        qb.where({ edipi })
          .andWhere('unit_org = :orgId', { orgId: req.appOrg!.id });
      },
    });

    const now = new Date();

    if (rosterEntries.some(roster => isActiveOnRoster(roster, now))) {
      throw new BadRequestError('The individual is already in the roster.');
    }
    if (!req.body.unit) {
      throw new BadRequestError('A unit must be supplied when adding a roster entry.');
    }

    const unit = await Unit.findOne({
      relations: ['org'],
      where: {
        org: req.appOrg?.id,
        id: req.body.unit,
      },
    });
    if (!unit) {
      throw new NotFoundError(`Unit with ID ${req.body.unit} could not be found.`);
    }

    const entry = new Roster();
    entry.unit = unit;
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    await setRosterParamsFromBody(req.appOrg!, entry, req.body, columns, true);
    const newRosterEntry = await entry.save();

    res.status(201).json(newRosterEntry);
  }

  async getRosterEntry(req: ApiRequest<OrgRosterParams>, res: Response) {
    const rosterId = req.params.rosterId;

    const queryBuilder = await queryAllowedRoster(req.appOrg!, req.appRole!);
    const rosterEntry = await queryBuilder
      .andWhere('roster.id=\':id\'', {
        id: rosterId,
      })
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
    const rosterId = req.params.rosterId;

    const entry = await Roster.findOne({
      relations: ['unit'],
      where: {
        id: rosterId,
      },
    });

    if (!entry) {
      throw new NotFoundError('User could not be found.');
    }

    if (req.body.unit) {
      const unit = await Unit.findOne({
        relations: ['org'],
        where: {
          org: req.appOrg?.id,
          id: req.body.unit,
        },
      });
      if (!unit) {
        throw new NotFoundError(`Unit with ID ${req.body.unit} could not be found.`);
      }
      entry.unit = unit;
    }
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    await setRosterParamsFromBody(req.appOrg!, entry, req.body, columns);
    const updatedRosterEntry = await entry.save();

    res.json(updatedRosterEntry);
  }

}

/**
 * This function queries the roster, returning only columns and rows that are allowed by the role of the requester.
 */
async function queryAllowedRoster(org: Org, role: Role) {
  const columns = await getAllowedRosterColumns(org, role);
  const queryBuilder = Roster.createQueryBuilder('roster').select([]);
  queryBuilder.leftJoin('roster.unit', 'u');
  // Always select the id column
  queryBuilder.addSelect('roster.id', 'id');
  queryBuilder.addSelect('u.id', 'unit');

  // Add all columns that are allowed by the user's role
  columns.forEach(column => {
    if (column.custom) {
      // Make sure custom columns are converted to appropriate types
      let selection: string;
      switch (column.type) {
        case RosterColumnType.Boolean:
          selection = `(roster.custom_columns ->> '${column.name}')::BOOLEAN`;
          break;
        case RosterColumnType.Number:
          selection = `(roster.custom_columns ->> '${column.name}')::DOUBLE PRECISION`;
          break;
        default:
          selection = `roster.custom_columns ->> '${column.name}'`;
          break;
      }
      queryBuilder.addSelect(selection, column.name);
    } else {
      queryBuilder.addSelect(`roster.${snakeCase(column.name)}`, column.name);
    }
  });

  // Filter out roster entries that are not on the active roster or are not allowed by the role's index prefix.
  return queryBuilder
    .where('u.org_id = :orgId', { orgId: org.id })
    .andWhere('(roster.end_date IS NULL OR roster.end_date > now())')
    .andWhere('(roster.start_date IS NULL OR roster.start_date < now())')
    .andWhere('u.id like :name', { name: role.indexPrefix.replace('*', '%') });
}

export async function getAllowedRosterColumns(org: Org, role: Role) {
  const allColumns = await getRosterColumns(org.id);
  const fineGrained = !(role.allowedRosterColumns.length === 1 && role.allowedRosterColumns[0] === '*');
  return allColumns.filter(column => {
    let allowed = true;
    if (fineGrained && role.allowedRosterColumns.indexOf(column.name) < 0) {
      allowed = false;
    } else if (!role.canViewPII && column.pii) {
      allowed = false;
    } else if (!role.canViewPHI && column.phi) {
      allowed = false;
    }
    return allowed;
  });
}

export async function getRosterColumns(orgId: number) {
  const customColumns = (await CustomRosterColumn.find({
    where: {
      org: orgId,
    },
  })).map(customColumn => {
    const columnInfo: RosterColumnInfo = {
      ...customColumn,
      displayName: customColumn.display,
      custom: true,
      updatable: true,
    };
    return columnInfo;
  });
  return [...baseRosterColumns, ...customColumns];
}

function setCustomColumnFromBody(column: CustomRosterColumn, body: CustomColumnData) {
  if (body.name) {
    column.name = body.name;
  }
  if (body.displayName) {
    column.display = body.displayName;
  }
  if (body.type) {
    column.type = body.type;
  }
  if (body.pii != null) {
    column.pii = body.pii;
  }
  if (body.phi != null) {
    column.phi = body.phi;
  }
  if (body.required != null) {
    column.required = body.required;
  }
}

function isActiveOnRoster(entry: Roster, date: Date) {
  return (!entry.startDate || entry.startDate.getTime() <= date.getTime())
    && (!entry.endDate || entry.endDate.getTime() >= date.getTime());
}

async function setRosterParamsFromBody(org: Org, entry: Roster, body: RosterEntryData, columns: RosterColumnInfo[], newEntry: boolean = false) {
  for (const column of columns) {
    if (newEntry || column.updatable) {
      await getColumnFromBody(org, entry, body, column, newEntry);
    }
  }
}

async function getColumnFromBody(org: Org, roster: Roster, row: RosterEntryData, column: RosterColumnInfo, newEntry: boolean) {
  let objectValue: Date | CustomColumnValue | undefined;
  let paramType: BaseType;
  switch (column.type) {
    case RosterColumnType.Date:
    case RosterColumnType.DateTime:
      paramType = 'string';
      break;
    default:
      paramType = column.type;
  }
  if (column.required && newEntry) {
    objectValue = getRequiredParam(column.name, row, paramType);
  } else {
    objectValue = getOptionalParam(column.name, row, paramType);
  }
  if (objectValue !== undefined) {
    if (objectValue === null && column.required) {
      throw new BadRequestError(`Required column '${column.name}' cannot be null.`);
    }
    if (column.custom) {
      if (!roster.customColumns) {
        roster.customColumns = {};
      }
      roster.customColumns[column.name] = objectValue;
    } else {
      if (objectValue !== null
        && (column.type === RosterColumnType.Date
          || column.type === RosterColumnType.DateTime)) {
        objectValue = dateFromString(`${objectValue}`);
      }
      Reflect.set(roster, column.name, objectValue !== null ? objectValue : undefined);
    }
  }
}

function getColumnFromCSV(roster: Roster, row: RosterFileRow, column: RosterColumnInfo) {
  let stringValue: string | undefined;
  if (column.required) {
    stringValue = getRequiredParam(column.name, row);
  } else {
    stringValue = getOptionalParam(column.name, row);
  }
  if (stringValue != null && stringValue.length > 0) {
    let value: any;
    switch (column.type) {
      case RosterColumnType.String:
        value = stringValue;
        break;
      case RosterColumnType.Number:
        if (stringValue.length > 0) {
          value = +stringValue;
        }
        break;
      case RosterColumnType.Date:
      case RosterColumnType.DateTime:
        value = dateFromString(stringValue);
        break;
      case RosterColumnType.Boolean:
        value = stringValue === 'true';
        break;
      default:
        break;
    }
    if (value !== undefined) {
      if (column.custom) {
        if (!roster.customColumns) {
          roster.customColumns = {};
        }
        roster.customColumns[column.name] = value;
      } else {
        Reflect.set(roster, column.name, value);
      }
    }
  }
}

function dateFromString(dateStr: string) {
  if (dateStr && dateStr.length > 0) {
    const numericDate = Number(dateStr);
    let date: Date;
    if (!Number.isNaN(numericDate)) {
      date = new Date(numericDate);
    } else {
      date = new Date(dateStr);
    }
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestError(`Unable to parse date '${dateStr}'.  Valid dates are ISO formatted date strings and UNIX timestamps.`);
    }
    return date;
  }
  return undefined;
}

interface RosterColumnWithValue extends RosterColumnInfo {
  value: CustomColumnValue,
}

interface RosterInfo {
  unit: Unit,
  id: number,
  columns: RosterColumnInfo[],
}

type ReportDateQuery = {
  reportDate: string
};

type RosterFileRow = {
  [key: string]: string
};

export type RosterEntryData = {
  [key: string]: CustomColumnValue
};

type CustomColumnData = {
  name?: string,
  displayName?: string,
  type?: RosterColumnType,
  pii?: boolean,
  phi?: boolean,
  required?: boolean,
};

export default new RosterController();
