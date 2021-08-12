import moment from 'moment-timezone';
import { Response } from 'express';
import { json2csvAsync } from 'json-2-csv';
import { ExportOrgQuery } from '@covid19-reports/shared';
import {
  ApiRequest,
  OrgParam,
} from '../api.router';
import { Observation } from '../observation/observation.model';
import { Roster } from '../roster/roster.model';
import { RosterHistory } from '../roster/roster-history.model';
import { Unit } from '../unit/unit.model';

class ExportSqlController {

  async exportOrgToCsv(req: ApiRequest<OrgParam, null, ExportOrgQuery>, res: Response) {
    const startDate = moment(req.query.startDate ?? 0);
    const endDate = moment(req.query.endDate);
    const orgId = req.params.orgId;
    const units: Unit[] = await Unit.createQueryBuilder('unit')
      .select('unit.name')
      .where(`unit.org_id = :orgId`, { orgId })
      .getRawMany();

    const unitNames: string[] = units.map(unit => unit.name);
    const rosterObservations = await Roster.createQueryBuilder('roster')
      .innerJoinAndSelect(Observation, 'observation', 'roster.edipi = observation.edipi')
      // TODO find out the columns we want to keep or filter out...for now, use all
      .select()
      .where('observation.unit in (:...unitNames)', { unitNames })
      .where('observation.timestamp between :startDate and :endDate', { startDate, endDate })
      .getRawMany();

    const csvChunk = await json2csvAsync(rosterObservations, {
      emptyFieldValue: '',
    });

    res.write(Buffer.from(csvChunk));
    res.end();
  }

  async exportRosterToCsv(req: ApiRequest<OrgParam, null, null>, res: Response) {
    const orgId = req.params.orgId;
    const units: Unit[] = await Unit.createQueryBuilder('unit')
      .select('unit.name, unit.id')
      .where(`unit.org_id = :orgId`, { orgId })
      .getRawMany();

    const unitIds: number[] = units.map(unit => unit.id);
    const history = await RosterHistory.createQueryBuilder('rosterHistory')
      .innerJoinAndSelect(Roster, 'roster', 'roster.edipi = rosterHistory.edipi')
      .select(`rosterHistory.edipi, 
        rosterHistory.first_name, 
        rosterHistory.last_name, 
        rosterHistory.phone_number, 
        rosterHistory.timestamp, 
        rosterHistory.change_type, 
        roster.unit_id, 
        roster.custom_columns`)
      .where('rosterHistory.unit_id in (:...unitIds)', { unitIds })
      .orderBy('roster.edipi', 'ASC')
      .addOrderBy('rosterHistory.timestamp', 'ASC')
      .getRawMany();

    const csvChunk = await json2csvAsync(history, {
      emptyFieldValue: '',
    });

    res.write(Buffer.from(csvChunk));
    res.end();
  }

}
export default new ExportSqlController();
