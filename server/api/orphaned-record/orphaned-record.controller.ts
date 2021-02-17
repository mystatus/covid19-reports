import { Response } from 'express';
import {
  ApiRequest, OrgParam,
} from '../index';
import { OrphanedRecord, IngestProcessor, applicationMapping } from './orphaned-record.model';
import { ActionType, OrphanedRecordAction } from './orphaned-record-action.model';
import { Org } from '../org/org.model';
import { BadRequestError } from '../../util/error-types';

interface OrphanedRecordResult {
  edipi: string;
  createdOn: Date;
  unit: string;
  phoneNumber: string;
  claimedUntil?: Date;
}

function getVisibleOrphanedRecords(userEdipi: string, orgId: number) {
  const params = {
    now: new Date(),
    orgId,
    userEdipi,
  };
  return OrphanedRecord
    .createQueryBuilder('orphan')
    .leftJoinAndMapMany('orphan.actions', OrphanedRecordAction, 'action', 'action.org_id=:orgId AND (action.expires_on IS NULL OR action.expires_on > :now) AND (action.type=\'claim\' OR (action.user_edipi=:userEdipi AND action.type=\'ignore\'))', params)
    .where('orphan.org_id=:orgId', params)
    .andWhere(`(action.type IS NULL OR (action.type='claim' AND action.user_edipi=:userEdipi))`, params)
    .addSelect('action.expires_on', 'claimed_until')
    .orderBy('orphan.createdOn', 'DESC')
    .getRawMany();
}

function mapToOrphanedRecordResult(orphanish: any) {
  const symptomObservationReport = orphanish.orphan_report as IngestProcessor.SymptomObservationReport;
  return {
    edipi: orphanish.orphan_edipi,
    createdOn: orphanish.orphan_createdOn,
    unit: symptomObservationReport?.Details?.Unit,
    phoneNumber: symptomObservationReport?.Details?.PhoneNumber,
    claimedUntil: orphanish.claimed_until,
  } as OrphanedRecordResult;
}

function projectToOrphanedRecordResult(orphanedRecords: OrphanedRecord[]) {
  return orphanedRecords.map(mapToOrphanedRecordResult);
}

class OrphanedRecordController {
  async getOrphanedRecords(req: ApiRequest<OrgParam>, res: Response) {
    const orphanedRecords = await getVisibleOrphanedRecords(req.appUser!.edipi, req.appOrg!.id);
    const orphanedRecordResults = projectToOrphanedRecordResult(orphanedRecords);
    res.json(orphanedRecordResults);
  }

  async addOrphanedRecord(req: ApiRequest<null, OrphanedRecordData>, res: Response) {
    const report = req.body.report;
    const reportingGroup = report.ReportingGroup ?? (report.Client?.Application && applicationMapping[report.Client?.Application]);
    const orphanedRecord = new OrphanedRecord();
    orphanedRecord.report = report;
    orphanedRecord.edipi = report.EDIPI;

    if (reportingGroup) {
      orphanedRecord.org = await Org.createQueryBuilder('org')
        .where('org.reportingGroup=:reportingGroup', { reportingGroup })
        .select('org.id', 'id')
        .getOne();
    }

    const newOrphanedRecord = await orphanedRecord.save();
    res.status(201).json(newOrphanedRecord);
  }

  async recordAction(req: ApiRequest<OrgParam, OrphanedRecordActionData>, res: Response) {
    if (!req.body.edipi) {
      throw new BadRequestError('EDIPI is required.');
    }
    if (!req.body.action) {
      throw new BadRequestError('Action is required.');
    }
    if (!(req.body.timeToLiveMs > 0)) {
      throw new BadRequestError('EDIPI is required.');
    }
    const existingAction = await OrphanedRecordAction.findOne({
      where: {
        user_edipi: req.appUser.edipi,
        edipi: req.body.edipi,
      },
    });
    if (existingAction) {
      await existingAction.remove();
    }

    const orphanedRecord = await OrphanedRecord
      .createQueryBuilder('orphan')
      .where('orphan.edipi=:edipi', { edipi: req.body.edipi })
      .limit(1)
      .getOne();

    if (!orphanedRecord) {
      throw new BadRequestError(`Unable to locate orphaned record for edipi: ${req.body.edipi}`);
    }

    const now = Date.now();
    const orphanedRecordAction = new OrphanedRecordAction();
    orphanedRecordAction.edipi = req.body.edipi;
    orphanedRecordAction.type = req.body.action;
    orphanedRecordAction.org = req.appOrg;
    orphanedRecordAction.user = req.appUser;
    orphanedRecordAction.createdOn = new Date(now);
    orphanedRecordAction.expiresOn = new Date(now + req.body.timeToLiveMs);

    const newOrphanedRecordAction = await orphanedRecordAction.save();
    res.status(201).json(newOrphanedRecordAction);
  }
}


export interface OrphanedRecordData {
  report: IngestProcessor.BaseReport
}

export interface OrphanedRecordActionData {
  edipi: string,
  action: ActionType,
  timeToLiveMs: number
}

export default new OrphanedRecordController();
