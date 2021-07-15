import { Response } from 'express';
import moment from 'moment-timezone';
import { In } from 'typeorm';
import { assertRequestQuery } from '../../util/api-utils';
import { ApiRequest, OrgRoleParams, Paginated} from '../api.router';
import { Roster } from '../roster/roster.model';
import { GetMusterRosterQuery } from './muster.controller';
import { Unit, MusterConfiguration } from '../unit/unit.model';


class MusterPostgresController {

  /**
   * Provides Muster Compliance details on the individual bases.
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

    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const unitId = req.query.unitId!;
    const orgId = req.appOrg!.id;


    const rosters = await this.getRosters(unitId, orgId);
    const unitsInRosters = rosters.map(r => r.unit.id);
    const unitsMusterConf = await this.getUnitsMusterConf(unitsInRosters);
    const musterInfo: MusterComplianceReport[] = rosters
      .map(roster => {
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
      });

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

    return res.json({ rows: this.toPageWithRowLimit(musterInfo, page, limit), totalRowsCount: musterInfo.length });
  }

  private async getRosters(unitId: number, orgId: number) {
    let rosters;
    if (unitId) {
      rosters = await Roster.find({ relations: ['unit', 'unit.org'], where: { unit: unitId } });
    } else {
      rosters = await Roster.find({ relations: ['unit', 'unit.org'] });
    }
    return rosters.filter(roster => roster.unit.org!.id === orgId);
  }

  private async getUnitsMusterConf(unitIds: number[]) {

    const unitsConf = await Unit.find({where: { unit: In(unitIds)}});
    const musterUnitConf = unitsConf.map(unitConf => {
      return {
        unitId: unitConf.id,
        musterConf: unitConf.musterConfiguration,
      };
    });

    if (this.isMusterConfMissing(musterUnitConf)) {

    }


  }

  private isMusterConfMissing(musterUnitConf: MusterUnitConfiguration[]) {
    const confWithMissingMusterConf = musterUnitConf.filter(conf => !conf.musterConf || conf.musterConf.length === 0);
    return confWithMissingMusterConf.length > 0;
  }

  private toPageWithRowLimit(musterInfo: MusterComplianceReport[], page: number, limit: number) {
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
