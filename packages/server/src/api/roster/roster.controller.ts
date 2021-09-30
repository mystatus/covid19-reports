import csv from 'csvtojson';
import { Response } from 'express';
import fs from 'fs';
import { getConnection, getManager, In } from 'typeorm';
import {
  AddCustomColumnBody,
  ColumnInfo,
  ColumnType,
  CustomColumnData,
  edipiColumnDisplayName,
  GetEntitiesQuery,
  Paginated,
  RosterEntryData,
  RosterFileRow,
  unitColumnDisplayName,
} from '@covid19-reports/shared';
import { EntityService } from '../../util/entity-utils';
import { assertRequestBody, assertRequestParams } from '../../util/api-utils';
import {
  BadRequestError,
  CsvRowError,
  NotFoundError,
  RosterUploadError,
  UnprocessableEntity,
} from '../../util/error-types';
import { addRosterEntry, editRosterEntry } from '../../util/roster-utils';
import { getDatabaseErrorMessage } from '../../util/typeorm-utils';
import { dateFromString, getMissingKeys } from '../../util/util';
import { ApiRequest, OrgColumnParams, OrgParam, OrgRosterParams } from '../api.router';
import { Unit } from '../unit/unit.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { ChangeType, RosterHistory } from './roster-history.model';
import { Roster } from './roster.model';
import { Org } from '../org/org.model';

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
    const columns = Roster.filterAllowedColumns(await Roster.getColumns(req.appOrg!), req.appUserRole!.role);
    const headers: string[] = ['Unit'];
    const example: string[] = ['unit1'];
    columns.forEach(column => {
      if (column.name === 'edipi') {
        headers.push('DoD ID');
        example.push('0000000001');
      } else {
        headers.push(column.displayName.includes('"') ? `"${column.displayName.replaceAll('"', '\\"')}"` : column.displayName);
        switch (column.type) {
          case ColumnType.Number:
            example.push('12345');
            break;
          case ColumnType.Boolean:
            example.push('false');
            break;
          case ColumnType.String:
            example.push('Example Text');
            break;
          case ColumnType.Date:
            example.push(new Date().toISOString().split('T')[0]);
            break;
          case ColumnType.DateTime:
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

  async getRoster(req: ApiRequest<OrgParam, null, GetEntitiesQuery>, res: Response<Paginated<RosterEntryData>>) {
    const service = new EntityService(Roster);
    res.json(await service.getEntities<RosterEntryData>(req.query, req.appOrg!, req.appUserRole!));
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

    const columns = Roster.filterAllowedColumns(await Roster.getColumns(req.appOrg!), req.appUserRole!.role);

    const requiredColumns = columns
      .filter(x => x.required)
      .map(x => x.displayName)
      .concat([unitColumnDisplayName]);

    const missingRequiredColumns = getMissingKeys(rosterCsvRows[0], requiredColumns);
    if (missingRequiredColumns.length > 0) {
      throw new BadRequestError(`Missing required column(s): ${missingRequiredColumns.map(x => `"${x}"`).join(', ')}`);
    }

    const existingEntries = await Roster.find({
      relations: ['org', 'unit'],
      where: {
        edipi: In(rosterCsvRows.map(x => x[edipiColumnDisplayName])),
        org: req.appOrg!.id,
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
        entry = getRosterEntryFromCsvRow(csvRow, columns, rowIndex, req.appOrg!, orgUnits, existingEntries);
        entry.org = req.appOrg!;
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

  async getRosterColumnsInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await Roster.getColumns(req.appOrg!);
    res.json(columns);
  }

  async getAllowedRosterColumnsInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = Roster.filterAllowedColumns(await Roster.getColumns(req.appOrg!, true), req.appUserRole!.role);
    res.json(columns);
  }

  async addRosterEntry(req: ApiRequest<OrgParam, RosterEntryData>, res: Response) {
    const newRosterEntry = await getManager().transaction(manager => {
      return addRosterEntry(req.appOrg!, req.appUserRole!.role, req.body, manager);
    });
    res.status(201).json(newRosterEntry);
  }

  async getRosterEntry(req: ApiRequest<OrgRosterParams>, res: Response) {
    const rosterId = req.params.rosterId;

    const columns = Roster.filterAllowedColumns(await Roster.getColumns(req.appOrg!), req.appUserRole!.role);
    const queryBuilder = await Roster.buildSearchQuery(req.appOrg!, req.appUserRole!, columns);
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

    const entry = await getManager().transaction(manager => {
      return editRosterEntry(req.appOrg!, req.appUserRole!, entryId, req.body, manager);
    });

    res.json(entry);
  }

}

export async function getRosterForIndividualOnDate(orgId: number, edipi: string, dateStr: string) {
  const reportDate = dateFromString(dateStr);

  if (!reportDate) {
    throw new BadRequestError('Missing reportDate.');
  }
  const timestamp = reportDate.getTime() / 1000;
  const entry = await RosterHistory.createQueryBuilder('roster')
    .select('roster.*')
    .where('roster.edipi = :edipi', { edipi })
    .andWhere('roster.org_id = :orgId', { orgId })
    .andWhere(`roster.timestamp <= to_timestamp(:timestamp) AT TIME ZONE '+0'`, { timestamp })
    .orderBy('roster.timestamp', 'DESC')
    .limit(1)
    .getOne();

  if (!entry || entry.changeType === ChangeType.Deleted) {
    return undefined;
  }
  return entry;
}

function getRosterEntryFromCsvRow(csvRow: RosterFileRow, columns: ColumnInfo[], rowIndex: number, org: Org, orgUnits: Unit[], existingEntries: Roster[]) {
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
  if (existingEntries.some(x => x.edipi === edipi)) {
    throw new CsvRowError(`Entry with ${edipiColumnDisplayName} ${edipi} already exists.`, csvRow, rowIndex, edipiColumnDisplayName);
  }

  // Create a new roster entry and set its columns from the csv row.
  const entry = new Roster();
  entry.unit = unit;
  entry.org = org;
  for (const column of columns) {
    try {
      entry.setColumnValueFromFileRow(column, csvRow);
    } catch (err) {
      throw new CsvRowError(err, csvRow, rowIndex, column.displayName);
    }
  }

  return entry;
}

export default new RosterController();
