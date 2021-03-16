import { Response } from 'express';
import { Brackets, getConnection } from 'typeorm';
import {
  ApiRequest, OrgParam,
} from '../index';
import { OrphanedRecord } from './orphaned-record.model';
import { ActionType, OrphanedRecordAction } from './orphaned-record-action.model';
import { Org } from '../org/org.model';
import { BadRequestError } from '../../util/error-types';
import { convertDateParam, reingestByDocumentId } from '../../util/reingest-utils';
import { ChangeType, RosterHistory } from '../roster/roster-history.model';
import { RosterEntryData } from '../roster/roster.controller';
import { addRosterEntry } from '../../util/roster-utils';

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
}

function getVisibleOrphanedRecordResults(userEdipi: string, orgId: number) {
  const params = {
    now: new Date(),
    orgId,
    userEdipi,
  };
  return OrphanedRecord
    .createQueryBuilder('orphan')
    .leftJoin(OrphanedRecordAction, 'action', `action.id=orphan.composite_id AND (action.expires_on > :now OR action.expires_on IS NULL) AND (action.type='claim' OR (action.user_edipi=:userEdipi AND action.type='ignore'))`, params)
    .where('orphan.org_id=:orgId', params)
    .andWhere('orphan.deleted_on IS NULL')
    .andWhere(`(action.type IS NULL OR (action.type='claim' AND action.user_edipi=:userEdipi))`, params)
    .select('orphan.edipi', 'edipi')
    .addSelect('orphan.unit', 'unit')
    .addSelect('orphan.phone', 'phone')
    .addSelect('action.type', 'action')
    .addSelect('action.expires_on', 'claimedUntil')
    .addSelect('MAX(orphan.timestamp)', 'latestReportDate')
    .addSelect('MIN(orphan.timestamp)', 'earliestReportDate')
    .addSelect('COUNT(*)::INTEGER', 'count')
    .addSelect('orphan.composite_id', 'id')
    .groupBy('orphan.composite_id')
    .addGroupBy('orphan.edipi')
    .addGroupBy('orphan.unit')
    .addGroupBy('orphan.phone')
    .addGroupBy('action.type')
    .addGroupBy('action.expires_on')
    .getRawMany<OrphanedRecordResult>();
}

class OrphanedRecordController {
  async getOrphanedRecords(req: ApiRequest<OrgParam>, res: Response) {
    const orphanedRecords = await getVisibleOrphanedRecordResults(req.appUser!.edipi, req.appOrg!.id);
    res.json(orphanedRecords);
  }

  async addOrphanedRecord(req: ApiRequest<null, OrphanedRecordData>, res: Response) {
    const orphanedRecord = new OrphanedRecord();
    orphanedRecord.documentId = req.body.documentId;
    orphanedRecord.timestamp = new Date(convertDateParam(req.body.timestamp));
    orphanedRecord.edipi = req.body.edipi;
    orphanedRecord.phone = req.body.phone;
    orphanedRecord.unit = req.body.unit;

    if (req.body.reportingGroup) {
      orphanedRecord.org = await Org.findOne({
        where: {
          reportingGroup: req.body.reportingGroup,
        },
      });
    }

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

  async resolveOrphanedRecord(req: ApiRequest<OrphanedRecordActionParam, RosterEntryData>, res: Response<OrphanedRecordResolveResponse>) {
    const orphanedRecords = await OrphanedRecord.find({
      where: {
        compositeId: req.params.orphanId,
        deletedOn: null,
      },
    });

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.orphanId}`);
    }

    const resultRecords: OrphanedRecordResolveItem[] = [];
    let lambdaInvocationCount = 0;
    let recordsIngested = 0;

    await getConnection().transaction(async manager => {
      // If the roster entry already exists, backdate the timestamp column
      // of the corresponding  'added' record in he roster history.
      // Otherwise, add the new roster entry and then update the roster history.

      let rosterHistory = await getRosterHistoryAddedForOrphanedRecord(orphanedRecords[0]);

      if (!rosterHistory) {
        // Add a new roster entry since the orphaned record
        // doesn't correspond to an existing roster entry
        await addRosterEntry(req.appOrg!, req.appUserRole!.role, req.body, manager);
        rosterHistory = await getRosterHistoryAddedForOrphanedRecord(orphanedRecords[0]);
      }

      if (rosterHistory) {
        // Backdate the timestamp to the earliest orphaned record time.
        rosterHistory.timestamp = new Date(Math.min(...[
          rosterHistory.timestamp.getTime(),
          ...orphanedRecords.map(x => x.timestamp.getTime()),
        ]));
        await manager.save(rosterHistory);
      }

      for (const orphanedRecord of orphanedRecords) {
        // Remove the orphan record entry
        await manager.remove(orphanedRecord);

        // Request a reingestion of a single document
        const reingestResult = await reingestByDocumentId(orphanedRecord.documentId);

        // Delete any outstanding actions
        await manager
          .createQueryBuilder()
          .delete()
          .from(OrphanedRecordAction)
          .where(`id=:id`, { id: req.params.orphanId })
          .orWhere('expires_on < now()')
          .execute();

        // Track the individual ingestion and postgres updated entity
        resultRecords.push({
          ...reingestResult,
          orphanedRecord,
        });

        // Keep track of our aggregate totals
        lambdaInvocationCount += reingestResult.lambdaInvocationCount;
        recordsIngested += reingestResult.recordsIngested;
      }
    });

    res.json({
      items: resultRecords,
      lambdaInvocationCount,
      recordsIngested,
    });
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


function getRosterHistoryAddedForOrphanedRecord(orphanedRecord: OrphanedRecord) {
  return RosterHistory.findOne({
    where: {
      edipi: orphanedRecord.edipi,
      changeType: ChangeType.Added,
    },
  });

}

export interface OrphanedRecordActionParam extends OrgParam {
  orphanId: string;
}

export interface OrphanedRecordResolveItem {
  lambdaInvocationCount: number;
  recordsIngested: number;
  orphanedRecord: OrphanedRecord;
}

export interface OrphanedRecordResolveResponse {
  lambdaInvocationCount: number;
  recordsIngested: number;
  items: OrphanedRecordResolveItem[];
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

export default new OrphanedRecordController();
