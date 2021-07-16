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


class MusterPostgresController {

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
    const userRole = req.appUserRole!;

    // dates come in GMT e.g.
    // Request URL: http://localhost:3000/api/muster/1/roster?
    // fromDate=2021-07-01T05:00:00.000Z&
    // toDate=2021-07-08T04:59:00.000Z
    const fromDate = moment(req.query.fromDate);
    const toDate = moment(req.query.toDate);
    const rowLimit = parseInt(req.query.limit);
    const pageNumber = parseInt(req.query.page);
    const unitId = req.query.unitId!;
    const orgId = req.appOrg!.id;

    const rosters: Roster[] = await MusterPostgresController.getRosters(unitId, orgId);

    const unitIds = MusterPostgresController.getUnitIds(rosters);

    const unitsMusterConf: MusterUnitConfiguration[] = await MusterPostgresController.setDefaultMusterConf(
      await MusterPostgresController.getMusterUnitConf(unitIds), orgId,
    );

    const musterComplianceReport: MusterComplianceReport[] = rosters.map(roster => MusterPostgresController.toMusterComplianceReport(roster));

    // TODO we want to fetch observations (edipi & ts only), figure out to which unit this observation belongs to
    // by going to roster with edipi, then we know which muster config we should use.

    const observations = await MusterPostgresController.getObservations(unitIds, fromDate, toDate);

    const musterCompliance = await MusterPostgresController.calculateMusterCompliance(observations, unitsMusterConf);

    MusterPostgresController.enrichMusterComplianceReport(musterComplianceReport, musterCompliance);

    return res.json({
      rows: MusterPostgresController.toPageWithRowLimit(musterComplianceReport, pageNumber, rowLimit),
      totalRowsCount: musterComplianceReport.length,
    });
  }

  /** Get an array of unique Unit IDs */
  private static getUnitIds(rosters: Roster[]): number[] {
    return Array.from(new Set(rosters.map(r => r.unit.id)));
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
    if (MusterPostgresController.isMusterConfMissing(musterUnitConf)) {
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

  private static async getObservations(unitIds: number[], fromDate: any | moment.Moment, toDate: any | moment.Moment) {
    console.log(fromDate, toDate, unitIds);

    const observations = await Observation.createQueryBuilder('observation')
      .select('observation.edipi, observation.timestamp, observation.unit')
      .getRawMany();


    console.log(JSON.stringify(observations));

  }

  private static async calculateMusterCompliance(observations: any, unitsMusterConf: MusterUnitConfiguration[]) {

  }

  private static enrichMusterComplianceReport(musterComplianceReport: MusterComplianceReport[], musterCompliance: void) {

  }

  private static toPageWithRowLimit(musterInfo: MusterComplianceReport[], page: number, limit: number): MusterComplianceReport[] {
    const offset = page * limit;
    return musterInfo.slice(offset, offset + limit);
  }
}

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

export default new MusterPostgresController();
