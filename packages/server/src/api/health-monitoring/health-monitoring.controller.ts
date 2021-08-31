import { Response } from 'express';
import moment from 'moment-timezone';
import { Paginated, PaginationParams } from '@covid19-reports/shared';
import { assertRequestQuery } from '../../util/api-utils';
import {
  ApiRequest,
  OrgRoleParams,
} from '../api.router';
import { Observation } from '../observation/observation.model';
import { Roster } from '../roster/roster.model';
import { Unit } from '../unit/unit.model';

class HealthMonitoringController {

  async getHealthMonitoringData(req: ApiRequest<OrgRoleParams, null, PaginationParams>, res: Response<Paginated<Roster & Observation>>) {
    assertRequestQuery(req, [
      'limit',
      'page',
    ]);

    // get units for orgId
    const orgId = req.appOrg!.id;
    const units = await Unit.find({
      where: {
        org: orgId,
      },
    });
    const unitIds = units.map(unit => unit.id);

    // get observations joined with roster data within last 14 days
    const rosterObservations = await Roster.createQueryBuilder('roster')
      .innerJoinAndSelect(Observation, 'observation', 'roster.edipi = observation.edipi')
      .select()
      .where('roster.unit_id in (:...unitIds)', { unitIds })
      .where('observation.timestamp between :startDate and :endDate', {
        startDate: moment.tz().subtract(14, 'days').startOf('day').toISOString(),
        endDate: moment.tz().endOf('day').toISOString(),
      })
      .getRawMany<Roster & Observation>();

    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const offset = page * limit;
    return res.json({
      rows: rosterObservations.slice(offset, offset + limit),
      totalRowsCount: rosterObservations.length,
    });
  }

}

export default new HealthMonitoringController();
