import csv from 'csvtojson';
import { Response } from 'express';
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import { In } from 'typeorm';
import {
  BadRequestError,
  CsvRowError,
  RosterUploadError,
  UnprocessableEntity,
} from '../../util/error-types';
import { getRequiredColumnDisplayNames } from '../../util/roster-utils';
import { getDatabaseErrorMessage } from '../../util/typeorm-utils';
import { getMissingKeys } from '../../util/util';
import { ApiRequest } from '../index';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { Roster } from '../roster/roster.model';
import {
  RosterColumnInfo,
  RosterHistoryChangeType,
  RosterHistoryFileRow,
  unitColumnDisplayName,
} from '../roster/roster.types';
import { Unit } from '../unit/unit.model';
import { RosterHistory } from './roster-history.model';

class RosterHistoryController {

  async getRosterHistoryTemplate(req: ApiRequest, res: Response) {
    const csvTemplate = await RosterHistory.getCsvTemplate(req.appOrg!);
    res.header('Content-Type', 'text/csv');
    res.attachment('roster-history-template.csv');
    res.send(csvTemplate);
  }

  async uploadRosterHistory(req: ApiRequest, res: Response) {
    if (!req.file || !req.file.path) {
      throw new BadRequestError('No file to process.');
    }

    let csvRows: RosterHistoryFileRow[];
    try {
      csvRows = await csv().fromFile(req.file.path) as RosterHistoryFileRow[];
    } catch (err) {
      throw new UnprocessableEntity('Roster history file was unable to be processed. Check that it is formatted correctly.');
    } finally {
      fs.unlinkSync(req.file.path);
    }

    if (csvRows.length === 0) {
      res.json({ count: 0 });
      return;
    }

    // Make sure the rows are in chronological order.
    csvRows.sort((a, b) => moment(a.Timestamp).diff(moment(b.Timestamp)));

    const orgUnits = await Unit.find({
      where: {
        org: req.appOrg!.id,
      },
    });
    if (!orgUnits) {
      throw new BadRequestError('No units found.');
    }

    const historyEntries = await buildRosterHistoryEntriesFromCsv(csvRows, req.appOrg!, req.appUserRole!.role, orgUnits);

    // Order is important here. We need to make sure the roster history gets rebuilt AFTER rebuilding
    // the roster table. Otherwise the roster history table will have extra rows from the trigger.
    await rebuildRosterTable(historyEntries, orgUnits);
    await rebuildRosterHistoryTable(historyEntries, orgUnits, csvRows);

    res.json({ message: 'ok' });
  }

}

async function buildRosterHistoryEntriesFromCsv(csvRows: RosterHistoryFileRow[], org: Org, role: Role, orgUnits: Unit[]) {
  const columns = await RosterHistory.getAllowedColumns(org, role);

  const requiredColumnDisplayNames = getRequiredColumnDisplayNames(columns);
  const missingRequiredColumns = getMissingKeys(csvRows[0], requiredColumnDisplayNames);
  if (missingRequiredColumns.length > 0) {
    throw new BadRequestError(`Missing required column(s): ${missingRequiredColumns.map(x => `"${x}"`).join(', ')}`);
  }

  // Build our new roster history from the csv rows.
  const historyEntries: RosterHistory[] = [];
  const rowErrors: CsvRowError[] = [];
  for (let rowIndex = 0; rowIndex < csvRows.length; rowIndex++) {
    const csvRow = csvRows[rowIndex];

    // Get roster history entry from the row.
    let historyEntry: RosterHistory;
    try {
      historyEntry = getRosterHistoryEntryFromCsvRow(csvRow, columns, rowIndex, orgUnits);
    } catch (err) {
      if (err instanceof CsvRowError) {
        rowErrors.push(err);
      } else {
        rowErrors.push(new CsvRowError(err.message, csvRow, rowIndex));
      }
      continue;
    }

    // Add the history entry to save later.
    historyEntries.push(historyEntry);
  }

  // Error check.
  if (rowErrors.length > 0) {
    throw new RosterUploadError(rowErrors);
  }

  return historyEntries;
}

function getRosterHistoryEntryFromCsvRow(csvRow: RosterHistoryFileRow, columns: RosterColumnInfo[], rowIndex: number, orgUnits: Unit[]) {
  const unitName = csvRow.Unit;
  if (!unitName) {
    throw new CsvRowError('"Unit" is required.', csvRow, rowIndex, unitColumnDisplayName);
  }

  const unit = orgUnits.find(u => unitName === u.name);
  if (!unit) {
    throw new CsvRowError(`Unit "${unitName}" could not be found in the group.`, csvRow, rowIndex, unitColumnDisplayName);
  }

  // Create a new roster entry and set its columns from the csv row.
  const entry = new RosterHistory();
  entry.unit = unit;
  for (const column of columns) {
    try {
      entry.setColumnValueFromFileRow(column, csvRow);
    } catch (err) {
      throw new CsvRowError(err.message, csvRow, rowIndex, column.displayName);
    }
  }

  return entry;
}

function buildRosterFromHistory(historyEntries: RosterHistory[]) {
  // Find the active roster from the history.
  const activeRosterHistory: { [edipiAndUnitId: string]: RosterHistory } = {};
  for (const historyEntry of historyEntries) {
    const { edipi, unit } = historyEntry;
    const edipiAndUnitId = `${edipi};${unit.id}`;
    if (historyEntry.changeType === RosterHistoryChangeType.Deleted) {
      delete activeRosterHistory[edipiAndUnitId];
    } else {
      activeRosterHistory[edipiAndUnitId] = historyEntry;
    }
  }

  // Build our new active roster.
  const rosterEntries: Roster[] = [];
  for (const historyEntry of Object.values(activeRosterHistory)) {
    const entry = new Roster();
    entry.edipi = historyEntry.edipi;
    entry.unit = historyEntry.unit;
    entry.firstName = historyEntry.firstName;
    entry.lastName = historyEntry.lastName;
    entry.customColumns = _.cloneDeep(historyEntry.customColumns);
    rosterEntries.push(entry);
  }

  return rosterEntries;
}

async function rebuildRosterTable(historyEntries: RosterHistory[], orgUnits: Unit[]) {
  const existingEntries = await Roster.find({
    where: {
      unit: In(orgUnits.map(x => x.id)),
    },
  });
  await Roster.remove(existingEntries);

  const rosterEntries = buildRosterFromHistory(historyEntries);

  try {
    await Roster.save(rosterEntries);
  } catch (err) {
    const message = getDatabaseErrorMessage(err);
    throw new Error(message);
  }
}

async function rebuildRosterHistoryTable(historyEntries: RosterHistory[], orgUnits: Unit[], csvRows: RosterHistoryFileRow[]) {
  validateRosterHistory(historyEntries, csvRows);

  // Clear the roster history and insert our rebuilt entries.
  const existingHistoryEntries = await RosterHistory.find({
    where: {
      unit: In(orgUnits.map(x => x.id)),
    },
  });
  await RosterHistory.remove(existingHistoryEntries);

  const rowErrors: CsvRowError[] = [];
  for (let i = 0; i < historyEntries.length; i++) {
    const historyEntry = historyEntries[i];

    try {
      await RosterHistory.save(historyEntry);
    } catch (err) {
      const message = getDatabaseErrorMessage(err);
      rowErrors.push(new CsvRowError(message, csvRows[i], i));
    }
  }

  // Error check.
  if (rowErrors.length > 0) {
    throw new RosterUploadError(rowErrors);
  }
}

function validateRosterHistory(historyEntries: RosterHistory[], csvRows: RosterHistoryFileRow[]) {
  // Save each previous history entry state so that we can check that the following entry
  // is a valid state change.
  const prevEntryStates: { [key: string]: RosterHistory } = {};

  for (let i = 0; i < historyEntries.length; i++) {
    const historyEntry = historyEntries[i];
    const entryKey = `${historyEntry.unit};${historyEntry.edipi}`;

    try {
      validateRosterHistoryEntry(historyEntry, prevEntryStates[entryKey]);
    } catch (err) {
      throw new CsvRowError(err.message, csvRows[i], i);
    }

    prevEntryStates[entryKey] = historyEntry;
  }
}

function validateRosterHistoryEntry(entry: RosterHistory, prevEntry: RosterHistory | undefined) {
  const { changeType } = entry;

  if (!prevEntry) {
    // The first entry for an individual on the unit must be an "added" change type.
    if (entry.changeType !== RosterHistoryChangeType.Added) {
      throw new Error('Individual was not on the unit at the time.');
    }

    return;
  }

  const { changeType: prevChangeType } = prevEntry;

  switch (changeType) {
    case RosterHistoryChangeType.Added:
      if (prevChangeType === RosterHistoryChangeType.Changed
        || prevChangeType === RosterHistoryChangeType.Added) {
        throw new Error('Unable to add individual. They were already on the unit at the time.');
      }
      break;
    case RosterHistoryChangeType.Changed:
    case RosterHistoryChangeType.Deleted:
      if (prevChangeType === RosterHistoryChangeType.Deleted) {
        throw new Error('Unable to update individual. They were not on the unit at the time.');
      }
      break;
    default:
      throw new Error('Unrecognized change type. Supported types are: added, changed, deleted');
  }
}

export default new RosterHistoryController();
