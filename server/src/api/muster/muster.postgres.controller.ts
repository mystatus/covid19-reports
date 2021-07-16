import { Response } from 'express';
import moment from 'moment-timezone';
import { In } from 'typeorm';
import { assertRequestQuery } from '../../util/api-utils';
import { ApiRequest, OrgRoleParams, Paginated} from '../api.router';
import { Roster } from '../roster/roster.model';
import { GetMusterRosterQuery } from './muster.controller';
import { Unit, MusterConfiguration } from '../unit/unit.model';
import { Org } from '../org/org.model';


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

    // TODO later
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fromDate = moment(req.query.fromDate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toDate = moment(req.query.toDate);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userRole = req.appUserRole!;

    const rowLimit = parseInt(req.query.limit);
    const pageNumber = parseInt(req.query.page);
    const unitId = req.query.unitId!;
    const orgId = req.appOrg!.id;


    const filteredRosters: Roster[] = await MusterPostgresController.getRosters(unitId, orgId);
    const unitsInRosters: number[] = MusterPostgresController.getUnitIds(filteredRosters);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unitsMusterConf: MusterUnitConfiguration[] = await MusterPostgresController.setDefaultMusterConf(
      await MusterPostgresController.getMusterUnitConf(unitsInRosters), orgId,
    );

    const intermediateMusterInfo: MusterComplianceReport[] = filteredRosters.map(roster => MusterPostgresController.toMasterInfo(roster));

    /*
      The muster page needs:
        MUSTER RATE - calculated:
          - we need the unit muster configuration
            - unit.muster_configuration
              [] when using the default one - Default: org.default_muster_configuration:
                [{"days":7,"startTime":"00:00","timezone":"America/Chicago","durationMinutes":120,"reportId":"es6ddssymptomobs"},
                {"days":32,"startTime":"09:00","timezone":"America/Chicago","durationMinutes":60,"reportId":"es6ddssymptomobs"}]
          - determine muster time windows
          - read the observation table to see when the user mustered
          - do the % compliance calculation
     */

    return res.json({
      rows: MusterPostgresController.toPageWithRowLimit(intermediateMusterInfo, pageNumber, rowLimit),
      totalRowsCount: intermediateMusterInfo.length,
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

  private static toMasterInfo(roster: Roster): MusterComplianceReport {
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
