import { Response } from 'express';
import { getConnection } from 'typeorm';
import {
  ApiRequest, OrgParam,
} from '../index';
import { OrphanedRecord } from './orphaned-record.model';
import { ActionType, OrphanedRecordAction } from './orphaned-record-action.model';
import { Org } from '../org/org.model';
import { BadRequestError } from '../../util/error-types';
import { convertDateParam, makeDocumentIdQuery, reingest } from '../reingest/reingest.controller';
import { RosterHistory } from '../roster/roster-history.model';
import { addRosterEntry, RosterEntryData } from '../roster/roster.controller';

interface OrphanedRecordResult {
  edipi: string;
  earliestReportDate: Date;
  phone: string;
  unit: string;
  count: number;
  claimedUntil?: Date;
}

function getVisibleOrphanedRecordResults(userEdipi: string, orgId: number) {
  const params = {
    now: new Date(),
    orgId,
    userEdipi,
  };
  return OrphanedRecord
    .createQueryBuilder('orphan')
    .leftJoin(OrphanedRecordAction, 'action', `action.id=orphan.join_key AND action.expires_on > :now AND (action.type='claim' OR (action.user_edipi=:userEdipi AND action.type='ignore'))`, params)
    .where('orphan.org_id=:orgId', params)
    .andWhere('orphan.deleted_on IS NULL')
    .andWhere(`(action.type IS NULL OR (action.type='claim' AND action.user_edipi=:userEdipi))`, params)
    .select('orphan.edipi', 'edipi')
    .addSelect('orphan.unit', 'unit')
    .addSelect('orphan.phone', 'phone')
    .addSelect('action.expires_on', 'claimedUntil')
    .addSelect('MIN(orphan.timestamp)', 'earliestReportDate')
    .addSelect('COUNT(*)::INTEGER', 'count')
    .groupBy('orphan.edipi')
    .addGroupBy('orphan.unit')
    .addGroupBy('orphan.phone')
    .addGroupBy('action.expires_on')
    .getRawMany<OrphanedRecordResult>();
}

class OrphanedRecordController {
  async getOrphanedRecords(req: ApiRequest<OrgParam>, res: Response) {
    const orphanedRecords = await getVisibleOrphanedRecordResults(req.appUser!.edipi, req.appOrg!.id);

    console.log(orphanedRecords);
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
      orphanedRecord.org = await Org.createQueryBuilder('org')
        .where('org.reportingGroup=:reportingGroup', { reportingGroup: req.body.reportingGroup })
        .select('org.id', 'id')
        .getOne();
    }

    const newOrphanedRecord = await orphanedRecord.save();
    res.status(201).json(newOrphanedRecord);
  }

  async deleteOrphanedRecord(req: ApiRequest<OrphanedRecordActionParam>, res: Response) {
    const orphanedRecords = await OrphanedRecord
      .createQueryBuilder('orphan')
      .where('orphan.joinKey=:joinKey', { joinKey: req.params.id })
      .getMany();

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.id}`);
    }

    const now = new Date();
    const result = Promise.all(orphanedRecords.map(orphanedRecord => {
      orphanedRecord.deletedOn = now;
      return orphanedRecord.save();
    }));
    res.json(result);
  }

  async resolveOrphanedRecord(req: ApiRequest<OrphanedRecordActionParam, RosterEntryData>, res: Response<OrphanedRecordResolveResponse>) {
    const orphanedRecords = await OrphanedRecord
      .createQueryBuilder('orphan')
      .where('orphan.joinKey=:joinKey', { joinKey: req.params.id })
      .andWhere('orphan.deletedOn IS NULL')
      .getMany();

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.id}`);
    }

    const [edipi] = req.params.id.split(';');
    const resultRecords: OrphanedRecordResolveItem[] = [];
    let lambdaInvocationCount = 0;
    let recordsIngested = 0;

    await getConnection().transaction(async manager => {
      // If the roster entry already exists, backdate the timestamp column
      // of the corresponding  'added' record in he roster history.
      // Otherwise, add a new roster entry.
      const rosterHistory = await manager
        .createQueryBuilder(RosterHistory, 'roster')
        .where('roster.edipi=:edipi', { edipi })
        .andWhere(`roster.change_type='added'`)
        .getOne();

      if (rosterHistory) {
        // Backdate the timestamp to the earliest orphaned record time.
        rosterHistory.timestamp = orphanedRecords.map(({ timestamp }) => timestamp).sort()[0];
        rosterHistory.save();
      } else {
        // Add a new roster entry
        addRosterEntry(req.appOrg!, req.appUserRole!.role, req.body);
      }

      for (const orphanedRecord of orphanedRecords) {
        // Remove the orphan record entry
        const newOrphanedRecord = await orphanedRecord.remove();

        // Request a reingestion of a single document
        const queryInput = makeDocumentIdQuery(orphanedRecord.documentId);
        const reingestResult = await reingest(queryInput);

        // Delete any outstanding actions
        await OrphanedRecordAction
          .createQueryBuilder()
          .delete()
          .where(`id=:id`, { id: req.params.id })
          .orWhere('expires_on < now()')
          .execute();

        // Track the individual ingestion and postgres save() results
        resultRecords.push({
          ...reingestResult,
          orphanedRecord: newOrphanedRecord,
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
    if (!req.params.id) {
      throw new BadRequestError(`Param 'id' is required.`);
    }
    if (req.params.id.split(';').length !== 4) {
      throw new BadRequestError(`Param 'id' is malformed. ${req.params.id}`);
    }
    if (!req.body.action) {
      throw new BadRequestError(`Expected 'action' in payload.`);
    }
    if (!(req.body.timeToLiveMs > 0)) {
      throw new BadRequestError(`Expected 'timeToLiveMs' in payload.`);
    }

    const existingAction = await OrphanedRecordAction.findOne({
      where: {
        user_edipi: req.appUser.edipi,
        id: req.params.id,
      },
    });
    if (existingAction) {
      await existingAction.remove();
    }

    const orphanedRecords = await OrphanedRecord
      .createQueryBuilder('orphan')
      .where('orphan.joinKey=:joinKey', { joinKey: req.params.id })
      .getMany();

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.id}`);
    }

    // 1231231231;17035813720;unit;1

    const now = Date.now();
    const orphanedRecordAction = new OrphanedRecordAction();
    orphanedRecordAction.id = req.params.id;
    orphanedRecordAction.type = req.body.action;
    orphanedRecordAction.user = req.appUser;
    orphanedRecordAction.createdOn = new Date(now);
    orphanedRecordAction.expiresOn = new Date(now + req.body.timeToLiveMs);

    const newOrphanedRecordAction = await orphanedRecordAction.save();
    res.status(201).json(newOrphanedRecordAction);
  }
}

export interface OrphanedRecordActionParam extends OrgParam {
  orgId: string;
  id: string;
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
  timeToLiveMs: number
}

export default new OrphanedRecordController();
