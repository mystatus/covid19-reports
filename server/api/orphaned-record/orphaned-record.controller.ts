import { Response } from 'express';
import {
  Brackets,
  getManager,
} from 'typeorm';
import {
  assertRequestBody,
  assertRequestQuery,
} from '../../util/api-utils';
import { BadRequestError } from '../../util/error-types';
import { buildVisibleOrphanedRecordResultsQuery } from '../../util/orphaned-records-utils';
import { convertDateParam } from '../../util/reingest-utils';
import {
  addRosterEntry,
  editRosterEntry,
} from '../../util/roster-utils';
import {
  ApiRequest,
  OrgParam,
  Paginated,
  PaginatedQuery,
} from '../index';
import { Org } from '../org/org.model';
import {
  RosterEntity,
  RosterEntryData,
} from '../roster/roster-entity';
import { Roster } from '../roster/roster.model';
import {
  ActionType,
  OrphanedRecordAction,
} from './orphaned-record-action.model';
import { OrphanedRecord } from './orphaned-record.model';

class OrphanedRecordController {

  async getOrphanedRecords(req: ApiRequest<OrgParam, null, PaginatedQuery>, res: Response<Paginated<OrphanedRecordResult>>) {
    assertRequestQuery(req, [
      'page',
      'limit',
    ]);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = page * limit;

    // For some reason when calling getCount() on this query TypeORM completely modifies it and returns an erroneous
    // count (returning the total row count instead of the aggregated count). So as a workaround just query
    // for all of the records and do pagination after.
    const query = buildVisibleOrphanedRecordResultsQuery(req.appUser!.edipi, req.appOrg!.id);
    const orphanedRecords = await query.getRawMany<OrphanedRecordResult>();

    res.json({
      rows: orphanedRecords.slice(offset, offset + limit),
      totalRowsCount: orphanedRecords.length,
    });
  }

  async addOrphanedRecord(req: ApiRequest<null, OrphanedRecordData>, res: Response) {
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

  async resolveOrphanedRecordWithAdd(req: ApiRequest<OrphanedRecordResolveParam, RosterEntryData>, res: Response) {
    const compositeId = req.params.orphanId;
    assertRequestBody(req, [
      'edipi',
      'unit',
    ]);
    const entryData = req.body;

    const orphanedRecords = await OrphanedRecord.find({
      where: {
        compositeId,
        deletedOn: null,
      },
    });

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${compositeId}`);
    }

    // We have to modify the roster outside of the transaction, since the orphaned record resolve process
    // depends on having the latest roster history from this addition.
    const entry = await getManager().transaction(async manager => {
      return addRosterEntry(req.appOrg!, req.appUserRole!.role, entryData, manager);
    });

    try {
      await getManager().transaction(async manager => {
        for (const orphanedRecord of orphanedRecords) {
          await orphanedRecord.resolve(entry, manager);
        }
      });
    } catch (err) {
      // If something went wrong we have to rollback the new entry manually.
      await entry.remove();

      throw err;
    }

    res.status(200).send();
  }

  async resolveOrphanedRecordWithEdit(req: ApiRequest<OrphanedRecordResolveParam, ResolveWithEditBody>, res: Response) {
    const compositeId = req.params.orphanId;
    assertRequestBody(req, [
      'edipi',
      'unit',
    ]);
    const { id: entryId, ...entryData } = req.body;

    const orphanedRecords = await OrphanedRecord.find({
      where: {
        compositeId,
        deletedOn: null,
      },
    });

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${compositeId}`);
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
    const entry = await getManager().transaction(async manager => {
      return editRosterEntry(req.appOrg!, req.appUserRole!, entryId, entryData, manager);
    });

    try {
      await getManager().transaction(async manager => {
        for (const orphanedRecord of orphanedRecords) {
          await orphanedRecord.resolve(entry, manager);
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

  async addOrphanedRecordAction(req: ApiRequest<OrphanedRecordActionParam, OrphanedRecordActionData>, res: Response) {
    if (!req.params.orphanId) {
      throw new BadRequestError(`Param 'id' is required.`);
    }
    if (!req.body.action) {
      throw new BadRequestError(`Expected 'action' in payload.`);
    }

    // Delete any existing actions for this user (or any expired ones)
    await OrphanedRecordAction
      .createQueryBuilder()
      .delete()
      .where(`id=:id`, { id: req.params.orphanId })
      .andWhere('user_edipi=:userEdipi', { userEdipi: req.appUser.edipi })
      .orWhere('expires_on < now()')
      .execute();

    const orphanedRecords = await OrphanedRecord.find({
      where: {
        compositeId: req.params.orphanId,
      },
    });

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.orphanId}`);
    }

    const orphanedRecordAction = new OrphanedRecordAction();
    orphanedRecordAction.id = req.params.orphanId;
    orphanedRecordAction.type = req.body.action;
    orphanedRecordAction.user = req.appUser;

    if (req.body.timeToLiveMs) {
      const date = new Date(Date.now() + req.body.timeToLiveMs);
      date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      orphanedRecordAction.expiresOn = date;
    }

    await orphanedRecordAction.save();
    res.status(201).json(orphanedRecordAction);
  }

  async deleteOrphanedRecordAction(req: ApiRequest<OrphanedRecordDeleteActionData>, res: Response) {
    if (!req.params.orphanId) {
      throw new BadRequestError(`Param 'id' is required.`);
    }
    if (!req.params.action) {
      throw new BadRequestError(`Expected 'action' in payload.`);
    }

    // Delete any existing actions for this user (or any expired ones)
    await OrphanedRecordAction
      .createQueryBuilder()
      .delete()
      .where(new Brackets(qb => {
        qb
          .where(`id=:id`, { id: req.params.orphanId })
          .andWhere('user_edipi=:userEdipi', { userEdipi: req.appUser.edipi })
          .andWhere('type=:action', { action: req.params.action });
      }))
      .orWhere('expires_on < now()')
      .execute();

    res.status(204).send();
  }

}
interface OrphanedRecordResult {
  id: string;
  edipi: string;
  phone: string;
  unit: string;
  count: number;
  action?: string;
  claimedUntil?: Date;
  latestReportDate: Date;
  earliestReportDate: Date;
  unitId?: number;
  rosterHistoryId?: number;
}

export interface OrphanedRecordActionParam extends OrgParam {
  orphanId: string;
}

export interface OrphanedRecordResolveParam extends OrphanedRecordActionParam {
  rosterHistoryId: string;
}

export interface OrphanedRecordData {
  documentId: string,
  timestamp: number,
  edipi: string,
  phone: string,
  reportingGroup: string,
  unit: string,
}

export interface OrphanedRecordActionData {
  action: ActionType,
  timeToLiveMs?: number
}

export interface OrphanedRecordDeleteActionData extends OrphanedRecordActionParam {
  action: ActionType,
}

type ResolveWithEditBody = RosterEntryData & {
  id: RosterEntity['id']
};

export default new OrphanedRecordController();
