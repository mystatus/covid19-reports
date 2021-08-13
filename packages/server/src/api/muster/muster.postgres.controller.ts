import { Response } from 'express';
import moment from 'moment-timezone';
import { GetMusterRosterQuery, Paginated } from '@covid19-reports/shared';
import { assertRequestQuery } from '../../util/api-utils';
import { ApiRequest, OrgRoleParams } from '../api.router';
import { Log } from '../../util/log';
import { calculateMusterCompliance, MusterCompliance } from './muster.compliance';
import { getRosterWithUnitsAndEdipis } from '../../util/roster-utils';
import { getMusteringOpportunities } from './mustering.opportunities';
import { getObservations } from '../observation/observation.utils';


class MusterPostgresCtr {

  /**
   * Provides Muster Compliance details for all service members for the given unit id(s)
   */
  async getUserMusterCompliance(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<MusterCompliance>>>) {
    Log.info('getUserMusterCompliance() - start');
    assertRequestQuery(req, ['fromDate', 'toDate', 'limit', 'page']);

    /* Dates come in UTC timezone.
      For example the date 2021-07-04 11:59 PM selected in a browser
                  comes as 2021-07-05T04:59:00.000Z */
    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);
    const rowLimit = parseInt(req.query.limit);
    const pageNumber = parseInt(req.query.page);
    // When unit id is missing, then data for all units are requested
    const unitId = req.query.unitId!;
    const orgId = req.appOrg!.id;

    Log.info(`getUserMusterCompliance() for ${JSON.stringify({ orgId, unitId, fromDate, toDate })}`);

    const rosters = await getRosterWithUnitsAndEdipis(unitId, orgId);
    const musterTimeView = await getMusteringOpportunities(orgId, rosters.unitIds, fromDate, toDate);
    const observations = await getObservations(rosters.edipis, fromDate, toDate);
    const musterCompliance = calculateMusterCompliance(observations, musterTimeView, rosters.roster);

    Log.info('getUserMusterCompliance() - end');

    return res.json({
      rows: toPageWithRowLimit(musterCompliance, pageNumber, rowLimit),
      totalRowsCount: musterCompliance.length,
    });
  }

}

function toPageWithRowLimit(musterInfo: MusterCompliance[], page: number, limit: number): MusterCompliance[] {
  const offset = page * limit;
  return musterInfo.slice(offset, offset + limit);
}

export default new MusterPostgresCtr();
