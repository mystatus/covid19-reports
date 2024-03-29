import { Response } from 'express';
import { getManager } from 'typeorm';
import {
  AddOrphanedRecordActionBody,
  AddOrphanedRecordBody,
  GetOrphanedRecordsQuery,
  Paginated,
  ResolveOrphanedRecordWithAddBody,
  ResolveOrphanedRecordWithEditBody,
} from '@covid19-reports/shared';
import {
  assertRequestBody,
  assertRequestParams,
  assertRequestQuery,
} from '../../util/api-utils';
import {
  BadRequestError,
  OrphanedRecordsNotFoundError,
} from '../../util/error-types';
import {
  deleteOrphanedRecordActionsForUser,
  getOrphanedRecordsForResolve,
  getVisibleOrphanedRecordResults,
  getVisibleOrphanedRecordResultsCount,
  OrphanedRecordResult,
} from '../../util/orphaned-records-utils';
import { convertDateParam } from '../../util/reingest-utils';
import {
  addRosterEntry,
  editRosterEntry,
} from '../../util/roster-utils';
import {
  ApiRequest,
  OrgParam,
  OrphanedRecordActionParam,
  OrphanedRecordDeleteActionParams,
  OrphanedRecordResolveParam,
} from '../api.router';
import { Org } from '../org/org.model';
import { Roster } from '../roster/roster.model';
import { OrphanedRecordAction } from './orphaned-record-action.model';
import { OrphanedRecord } from './orphaned-record.model';

class OrphanedRecordController {

  async getOrphanedRecordsCount(req: ApiRequest, res: Response) {
    const count = await getVisibleOrphanedRecordResultsCount({
      userEdipi: req.appUser!.edipi,
      orgId: req.appOrg!.id,
    });

    res.json({ count });
  }

  async getOrphanedRecords(req: ApiRequest<OrgParam, null, GetOrphanedRecordsQuery>, res: Response<Paginated<OrphanedRecordResult>>) {
    assertRequestQuery(req, [
      'page',
      'limit',
    ]);
    const page = parseInt(req.query.page ?? '0');
    const limit = parseInt(req.query.limit ?? '10');
    const unit = req.query.unit;
    const offset = page * limit;

    const orphanedRecords = await getVisibleOrphanedRecordResults({
      userEdipi: req.appUser!.edipi,
      orgId: req.appOrg!.id,
      unit,
    });

    res.json({
      rows: orphanedRecords.slice(offset, offset + limit),
      totalRowsCount: orphanedRecords.length,
    });
  }

  async addOrphanedRecord(req: ApiRequest<null, AddOrphanedRecordBody>, res: Response) {
    if (!req.body.reportingGroup) {
      throw new BadRequestError('Missing reportingGroup from body.');
    }

    const orphanedRecord = new OrphanedRecord();
    orphanedRecord.documentId = req.body.documentId;
    orphanedRecord.timestamp = new Date(convertDateParam(req.body.timestamp));
    orphanedRecord.edipi = req.body.edipi;
    orphanedRecord.phone = req.body.phone;
    orphanedRecord.unit = req.body.unit;

    const orphanedRecords = await OrphanedRecord.find({
      where: {
        documentId: req.body.documentId,
      },
    });

    if (orphanedRecords.length > 0) {
      res.status(200).json(orphanedRecord);
      return;
    }

    orphanedRecord.org = await Org.findOne({
      where: {
        reportingGroup: req.body.reportingGroup,
      },
    });

    await orphanedRecord.save();
    res.status(201).json(orphanedRecord);
  }

  async deleteOrphanedRecord(req: ApiRequest<OrphanedRecordActionParam>, res: Response) {
    const orphanedRecords = await OrphanedRecord.find({
      where: {
        compositeId: req.params.orphanId,
      },
    });

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.orphanId}`);
    }

    const result = Promise.all(orphanedRecords.map(orphanedRecord => orphanedRecord.softRemove()));
    res.json(result);
  }

  async resolveOrphanedRecordWithAdd(req: ApiRequest<OrphanedRecordResolveParam, ResolveOrphanedRecordWithAddBody>, res: Response) {
    const compositeId = req.params.orphanId;
    assertRequestBody(req, [
      'edipi',
      'unit',
    ]);
    const entryData = req.body;

    const orphanedRecords = await getOrphanedRecordsForResolve(compositeId);
    if (orphanedRecords.length === 0) {
      throw new OrphanedRecordsNotFoundError(compositeId);
    }

    // We have to modify the roster outside of the transaction, since the orphaned record resolve process
    // depends on having the latest roster history from this addition.
    const entry = await getManager().transaction(manager => {
      return addRosterEntry(req.appOrg!, req.appUserRole!.role, entryData, manager);
    });

    try {
      await getManager().transaction(async manager => {
        for (const orphanedRecord of orphanedRecords) {
          await orphanedRecord.resolve(entry, manager, req.appOrg!.id);
        }
      });
    } catch (err) {
      // If something went wrong we have to rollback the new entry manually.
      await entry.remove();

      throw err;
    }

    res.status(200).send();
  }

  async resolveOrphanedRecordWithEdit(req: ApiRequest<OrphanedRecordResolveParam, ResolveOrphanedRecordWithEditBody>, res: Response) {
    const compositeId = req.params.orphanId;
    assertRequestBody(req, [
      'edipi',
      'unit',
    ]);
    const { id: entryId, ...entryData } = req.body;

    const orphanedRecords = await getOrphanedRecordsForResolve(compositeId);
    if (orphanedRecords.length === 0) {
      throw new OrphanedRecordsNotFoundError(compositeId);
    }

    // Save out the old entry data in case something goes wrong and we need to rollback.
    const oldEntry = await Roster.findOne({
      relations: ['unit'],
      where: {
        id: entryId,
      },
    });

    if (!oldEntry) {
      throw new BadRequestError(`Unable to locate roster entry with id: ${entryId}`);
    }

    const oldEntryData = oldEntry.toData();

    // We have to modify the roster outside of the transaction, since the orphaned record resolve process
    // depends on having the latest roster history from this addition.
    const entry = await getManager().transaction(manager => {
      return editRosterEntry(req.appOrg!, req.appUserRole!, entryId, entryData, manager);
    });

    try {
      await getManager().transaction(async manager => {
        for (const orphanedRecord of orphanedRecords) {
          await orphanedRecord.resolve(entry, manager, req.appOrg!.id);
        }
      });
    } catch (err) {
      // If something went wrong we have to rollback the entry manually.
      await getManager().transaction(async manager => {
        await editRosterEntry(req.appOrg!, req.appUserRole!, entryId, oldEntryData, manager);
      });

      throw err;
    }

    res.status(200).send();
  }

  async addOrphanedRecordAction(req: ApiRequest<OrphanedRecordActionParam, AddOrphanedRecordActionBody>, res: Response) {
    const { orphanId: compositeId } = assertRequestParams(req, ['orphanId']);
    const { action, timeToLiveMs } = assertRequestBody(req, ['action']);

    await deleteOrphanedRecordActionsForUser(compositeId, req.appUser.edipi);

    const orphanedRecords = await getOrphanedRecordsForResolve(compositeId);
    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${compositeId}`);
    }

    const orphanedRecordAction = new OrphanedRecordAction();
    orphanedRecordAction.id = compositeId;
    orphanedRecordAction.type = action;
    orphanedRecordAction.user = req.appUser;

    if (timeToLiveMs) {
      const localDate = new Date(Date.now() + timeToLiveMs);
      const zuluDate = new Date(localDate.toISOString());
      orphanedRecordAction.expiresOn = new Date(zuluDate);
    }

    await orphanedRecordAction.save();
    res.status(201).json(orphanedRecordAction);
  }

  async deleteOrphanedRecordAction(req: ApiRequest<OrphanedRecordDeleteActionParams>, res: Response) {
    const { orphanId: compositeId, action } = assertRequestParams(req, [
      'orphanId',
      'action',
    ]);

    await deleteOrphanedRecordActionsForUser(compositeId, req.appUser.edipi, action);

    res.status(204).send();
  }

}

export default new OrphanedRecordController();
