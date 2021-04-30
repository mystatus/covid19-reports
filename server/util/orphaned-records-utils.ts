import { Brackets } from 'typeorm';
import { OrphanedRecordAction } from '../api/orphaned-record/orphaned-record-action.model';
import { OrphanedRecord } from '../api/orphaned-record/orphaned-record.model';
import { RosterHistory } from '../api/roster/roster-history.model';
import { User } from '../api/user/user.model';

export function getOrphanedRecordsForResolve(compositeId: OrphanedRecord['compositeId']) {
  return OrphanedRecord.find({
    where: {
      compositeId,
      deletedOn: null,
    },
  });
}

export function deleteOrphanedRecordActionsForUser(
  compositeId: OrphanedRecord['compositeId'],
  edipi: User['edipi'],
  action?: OrphanedRecordAction['type'],
) {
  return OrphanedRecordAction.createQueryBuilder()
    .delete()
    .where(new Brackets(qb => {
      qb.where(`id = :id`, { id: compositeId })
        .andWhere('user_edipi = :edipi', { edipi });

      if (action) {
        qb.andWhere('type = :action', { action });
      }
    }))
    .orWhere('expires_on < now()')
    .execute();
}

export function buildVisibleOrphanedRecordResultsQuery(userEdipi: string, orgId: number) {
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
    .andWhere(`(roster.change_type IS NULL OR roster.change_type <> 'deleted')`)
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
