import { Response } from 'express';
import {
  Brackets,
  getConnection,
} from 'typeorm';
import { assertRequestQuery } from '../../util/api-utils';
import {
  ApiRequest,
  OrgParam,
  PaginatedQuery,
  Paginated,
} from '../index';
import { OrphanedRecord } from './orphaned-record.model';
import {
  ActionType,
  OrphanedRecordAction,
} from './orphaned-record-action.model';
import { Org } from '../org/org.model';
import {
  BadRequestError,
  InternalServerError,
} from '../../util/error-types';
import {
  convertDateParam,
  reingestByDocumentId,
} from '../../util/reingest-utils';
import { RosterHistory } from '../roster/roster-history.model';
import { RosterEntryData } from '../roster/roster.controller';
import { addRosterEntry } from '../../util/roster-utils';
import { Roster } from '../roster/roster.model';

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

  async resolveOrphanedRecord(req: ApiRequest<OrphanedRecordResolveParam, RosterEntryData>, res: Response<OrphanedRecord>) {
    const orphanedRecords = await OrphanedRecord.find({
      where: {
        compositeId: req.params.orphanId,
        deletedOn: null,
      },
    });

    if (orphanedRecords.length === 0) {
      throw new BadRequestError(`Unable to locate orphaned record with id: ${req.params.orphanId}`);
    }
    if (orphanedRecords.length > 1) {
      throw new BadRequestError(`Encountered Multiple Orphaned Records: ${req.params.orphanId}`);
    }

    const orphanedRecord = orphanedRecords[0];
    const documentId = orphanedRecord.documentId;
    let rosterHistory: RosterHistory[] = [];

    if (req.body.unit) {
      rosterHistory = await getRosterHistoryForOrphanedRecord(orphanedRecord, req.body.unit);
    }

    let newRosterEntry: Roster | undefined;
    if (!rosterHistory.length) {
      // Add a new roster entry since the orphaned record
      // doesn't correspond to an existing roster entry
      newRosterEntry = await addRosterEntry(req.appOrg!, req.appUserRole!.role, req.body);
      rosterHistory = await getRosterHistoryForOrphanedRecord(orphanedRecord, newRosterEntry.unit.id);
    }

    if (!rosterHistory.length) {
      throw new InternalServerError('Unable to locate RosterHistory record.');
    }

    try {
      await getConnection().transaction(async manager => {
        let timestamp = Math.min(...orphanedRecords.map(x => x.timestamp.getTime()));
        for (const item of rosterHistory) {
          // Backdate the timestamp to the earliest orphaned record time.
          item.timestamp = new Date(
            Math.min(item.timestamp.getTime(), timestamp),
          );

          // Ensure that two records don't have the same value
          timestamp -= 1;
        }

        // Save the updated timestamp
        await manager.save(rosterHistory);

        // Remove the orphan record entry
        await manager.softRemove(orphanedRecord);

        // Delete any outstanding actions
        await manager
          .createQueryBuilder()
          .delete()
          .from(OrphanedRecordAction)
          .where(`id=:id`, { id: req.params.orphanId })
          .orWhere('expires_on < now()')
          .execute();
      });
    } catch (err) {
      if (newRosterEntry) {
        await newRosterEntry.remove();
      }
      throw err;
    }

    // Request a reingestion of a single document. Don't await on this since it may take a while
    // and can safely run in the background.
    reingestByDocumentId(documentId).then();

    res.json(orphanedRecord);
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

async function getRosterHistoryForOrphanedRecord(orphanedRecord: OrphanedRecord, unitId: number) {
  return RosterHistory.createQueryBuilder('rh')
    .where('rh.unit_id = :unitId', { unitId })
    .andWhere('rh.edipi = :edipi', { edipi: orphanedRecord.edipi })
    .addOrderBy('rh.edipi', 'DESC')
    .addOrderBy('rh.change_type', 'DESC')
    .getMany();
}

function buildVisibleOrphanedRecordResultsQuery(userEdipi: string, orgId: number) {
  const params = {
    now: new Date(),
    orgId,
    userEdipi,
  };

  const rosterEntries = RosterHistory.createQueryBuilder('rh')
    .leftJoin('rh.unit', 'u')
    .select('rh.id', 'id')
    .addSelect('rh.edipi', 'edipi')
    .addSelect('rh.timestamp', 'timestamp')
    .addSelect('rh.change_type', 'change_type')
    .addSelect('rh.unit_id', 'unit_id')
    .where('u.org_id = :orgId', { orgId })
    .distinctOn(['rh.unit_id', 'rh.edipi'])
    .orderBy('rh.unit_id')
    .addOrderBy('rh.edipi', 'DESC')
    .addOrderBy('rh.timestamp', 'DESC')
    .addOrderBy('rh.change_type', 'DESC');

  return OrphanedRecord.createQueryBuilder('orphan')
    .leftJoin(OrphanedRecordAction, 'action', `action.id=orphan.composite_id AND (action.expires_on > :now OR action.expires_on IS NULL) AND (action.type='claim' OR (action.user_edipi=:userEdipi AND action.type='ignore'))`, params)
    .leftJoin(`(${rosterEntries.getQuery()})`, 'roster', 'orphan.edipi = roster.edipi')
    .where('orphan.org_id=:orgId', params)
    .andWhere('orphan.deleted_on IS NULL')
    .andWhere(`(roster.change_type IS NULL OR (roster.change_type <> 'deleted'))`)
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
    .addSelect('roster.unit_id', 'unitId')
    .addSelect('roster.id', 'rosterHistoryId')
    .orderBy('orphan.count', 'DESC')
    .addOrderBy('orphan.unit', 'ASC')
    .addOrderBy('orphan.edipi', 'ASC')
    .groupBy('orphan.composite_id')
    .addGroupBy('orphan.edipi')
    .addGroupBy('orphan.unit')
    .addGroupBy('orphan.phone')
    .addGroupBy('action.type')
    .addGroupBy('action.expires_on')
    .addGroupBy('roster.unit_id')
    .addGroupBy('roster.id');
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

export default new OrphanedRecordController();
