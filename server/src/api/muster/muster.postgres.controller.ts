import { Response } from 'express';
import moment from 'moment-timezone';
import { In } from 'typeorm';
import { assertRequestQuery } from '../../util/api-utils';
import { ApiRequest, OrgRoleParams, Paginated} from '../api.router';
import { Roster } from '../roster/roster.model';
import { GetMusterRosterQuery } from './muster.controller';
import { Unit, MusterConfiguration } from '../unit/unit.model';
import { Org } from '../org/org.model';
import { Observation } from '../observation/observation.model';


class MusterPostgresCtr {

  /**
   * Provides Muster Compliance details for all service members
   */
  async getMusterRoster(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<MusterComplianceReport>>>) {
    assertRequestQuery(req, [
      'fromDate',
      'toDate',
      'limit',
      'page',
    ]);

    // TODO ??
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userRole = req.appUserRole!;

    console.log(req.query.toDate);
    /* Dates come in UTC timezone.
      For example the date 2021-07-04 11:59 PM selected in a browser
                  comes as 2021-07-05T04:59:00.000Z */
    console.log(`from: ${req.query.fromDate}`, `to: ${req.query.toDate}`);
    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);
    const rowLimit = parseInt(req.query.limit);
    const pageNumber = parseInt(req.query.page);
    const unitId = req.query.unitId!;
    const orgId = req.appOrg!.id;

    const rosters: Roster[] = await MusterPostgresCtr.getRosters(unitId, orgId);

    const unitIds = MusterPostgresCtr.getUnitIds(rosters);

    const edipis = MusterPostgresCtr.getEdipi(rosters);

    const unitsMusterConf: MusterUnitConfiguration[] = await MusterPostgresCtr.setDefaultMusterConf(
      await MusterPostgresCtr.getMusterUnitConf(unitIds), orgId,
    );

    const observations = await MusterPostgresCtr.getObservations(edipis, fromDate, toDate);

    const musterComplianceReport: MusterComplianceReport[] = rosters.map(roster => MusterPostgresCtr.toMusterComplianceReport(roster));

    const musterCompliance = await MusterPostgresCtr.calculateMusterCompliance(observations, unitsMusterConf);

    MusterPostgresCtr.enrichMusterComplianceReport(musterComplianceReport, musterCompliance);

    return res.json({
      rows: MusterPostgresCtr.toPageWithRowLimit(musterComplianceReport, pageNumber, rowLimit),
      totalRowsCount: musterComplianceReport.length,
    });
  }

  /** Get an array of unique Unit IDs */
  private static getUnitIds(rosters: Roster[]): number[] {
    return Array.from(new Set(rosters.map(r => r.unit.id)));
  }

  /** Get an array of unique edipis */
  private static getEdipi(rosters: Roster[]): string[] {
    return Array.from(new Set(rosters.map(r => r.edipi)));
  }

  private static async getRosters(unitId: number, orgId: number): Promise<Roster[]> {
    let rosters;
    if (unitId) {
      rosters = await Roster.find({ relations: ['unit', 'unit.org'], where: { unit: unitId } });
    } else {
      rosters = await Roster.find({ relations: ['unit', 'unit.org'] });
    }
    return rosters.filter(roster => roster.unit.org!.id === orgId);
  }

  private static async getMusterUnitConf(unitIds: number[]): Promise<MusterUnitConfiguration[]> {
    return (await Unit.find({ where: { id: In(unitIds) } })).map(unitConf => {
      return {
        unitId: unitConf.id,
        musterConf: unitConf.musterConfiguration,
      };
    });
  }

  /**
   * Sets default muster configuration where muster configuration is missing.
   * This function has a side effect, it modifies musterUnitConf.
   */
  private static async setDefaultMusterConf(musterUnitConf: MusterUnitConfiguration[], orgId: number): Promise<MusterUnitConfiguration[]> {
    if (MusterPostgresCtr.isMusterConfMissing(musterUnitConf)) {
      const org = await Org.findOne({ where: { id: orgId } });
      if (org) {
        const defaultOrgMusterConf = org.defaultMusterConfiguration;
        musterUnitConf.forEach(muc => {
          if (!muc.musterConf || muc.musterConf.length === 0) {
            muc.musterConf = defaultOrgMusterConf;
          }
        });
      }
    }
    return musterUnitConf;
  }

  private static isMusterConfMissing(musterUnitConf: MusterUnitConfiguration[]): boolean {
    const confWithMissingMusterConf = musterUnitConf.filter(conf => !conf.musterConf || conf.musterConf.length === 0);
    return confWithMissingMusterConf.length > 0;
  }

  private static toMusterComplianceReport(roster: Roster): MusterComplianceReport {
    return {
      totalMusters: 1,
      mustersReported: 0,
      musterPercent: 0,
      edipi: roster.edipi,
      firstName: roster.firstName,
      lastName: roster.lastName,
      myCustomColumn1: 'tbd',
      unitId: roster.unit.id,
      phone: roster.phoneNumber,
    };
  }

  private static async getObservations(edipis: string[], fromDate: any | moment.Moment, toDate: any | moment.Moment) : Promise<FilteredObservation[]> {
    const observations = await Observation.createQueryBuilder('observation')
      .select('observation.edipi, observation.timestamp')
      .where('observation.timestamp <= to_timestamp(:tsTo)', {tsTo: toDate.unix()})
      .andWhere('observation.timestamp >= to_timestamp(:tsFrom)', {tsFrom: fromDate.unix()})
      .andWhere('observation.edipi IN (:...edipis)', {edipis})
      .getRawMany();

    console.log(JSON.stringify(observations));
    return observations;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static async calculateMusterCompliance(observations: FilteredObservation[], unitsMusterConf: MusterUnitConfiguration[]) {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static enrichMusterComplianceReport(musterComplianceReport: MusterComplianceReport[], musterCompliance: void) {

  }

  private static toPageWithRowLimit(musterInfo: MusterComplianceReport[], page: number, limit: number): MusterComplianceReport[] {
    const offset = page * limit;
    return musterInfo.slice(offset, offset + limit);
  }
}

type FilteredObservation = {
  edipi: number
  unitId: string
  timestamp: string
};

type MusterUnitConfiguration = {
  unitId: number
  musterConf: MusterConfiguration[]
};

type MusterComplianceReport = {
  totalMusters: number
  mustersReported: number
  musterPercent: number
  edipi: string
  firstName: string
  lastName: string
  myCustomColumn1: string,
  unitId: number
  phone: string
};

export default new MusterPostgresCtr();
