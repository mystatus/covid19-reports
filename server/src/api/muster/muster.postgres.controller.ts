import { Response } from 'express';
import moment from 'moment-timezone';
import { In } from 'typeorm';
import { assertRequestQuery } from '../../util/api-utils';
import { ApiRequest, OrgRoleParams, Paginated} from '../api.router';
import { Roster } from '../roster/roster.model';
import { GetMusterRosterQuery } from './muster.controller';
import { Unit, MusterConfiguration, MusterConfWithDateArray } from '../unit/unit.model';
import { Org } from '../org/org.model';
import { Observation } from '../observation/observation.model';
import {daysToString} from './muster.days';


class MusterPostgresCtr {

  /**
   * Provides Muster Compliance details for all service members
   */
  async getMusterRoster(req: ApiRequest<OrgRoleParams, null, GetMusterRosterQuery>, res: Response<Paginated<Partial<MusterCompliance>>>) {
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
    const musterUnitConf = await MusterPostgresCtr.getMusterUnitConf(unitIds);
    const unitsMusterConf = await MusterPostgresCtr.setDefaultMusterConf(musterUnitConf, orgId);
    const observations = await MusterPostgresCtr.getObservations(edipis, fromDate, toDate);
    const musterIntermediateCompliance = rosters.map(roster => MusterPostgresCtr.toMusterIntermediateCompliance(roster));
    const musterTimeView = this.toMusterTimeView(musterUnitConf, fromDate, toDate);
    console.log(JSON.stringify(musterTimeView));
    const musterCompliance = MusterPostgresCtr.calculateMusterCompliance(observations, unitsMusterConf, musterIntermediateCompliance);

    return res.json({
      rows: MusterPostgresCtr.toPageWithRowLimit(musterCompliance, pageNumber, rowLimit),
      totalRowsCount: musterIntermediateCompliance.length,
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

  private static async getMusterUnitConf(unitIds: number[]): Promise<UnitMusterConfFromDb[]> {
    return (await Unit.find({ where: { id: In(unitIds) } })).map(unitConf => {
      return {
        unitId: unitConf.id,
        musterConf: unitConf.musterConfiguration,
      };
    });
  }

  // TODO: refactor, see: https://github.com/mystatus/covid19-reports/pull/171/files#r673474693
  /**
   * Sets default muster configuration where muster configuration is missing.
   * This function has a side effect, it modifies musterUnitConf.
   */
  private static async setDefaultMusterConf(musterUnitConf: UnitMusterConfFromDb[], orgId: number): Promise<UnitMusterConfFromDb[]> {
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

  private static isMusterConfMissing(musterUnitConf: UnitMusterConfFromDb[]): boolean {
    const confWithMissingMusterConf = musterUnitConf.filter(conf => !conf.musterConf || conf.musterConf.length === 0);
    return confWithMissingMusterConf.length > 0;
  }

  private static toMusterIntermediateCompliance(roster: Roster): IntermediateMusterCompliance {
    return {
      edipi: roster.edipi,
      firstName: roster.firstName,
      lastName: roster.lastName,
      myCustomColumn1: 'tbd',
      unitId: roster.unit.id,
      phone: roster.phoneNumber,
    };
  }

  private static async getObservations(edipis: Edipi[], fromDate: any | moment.Moment, toDate: any | moment.Moment) : Promise<FilteredObservation[]> {
    const observations = await Observation.createQueryBuilder('observation')
      .select('observation.edipi, observation.timestamp')
      .where('observation.timestamp <= to_timestamp(:tsTo)', {tsTo: toDate.unix()})
      .andWhere('observation.timestamp >= to_timestamp(:tsFrom)', {tsFrom: fromDate.unix()})
      .andWhere('observation.edipi IN (:...edipis)', {edipis})
      .getRawMany();

    console.log(JSON.stringify(observations));
    return observations;
  }

  /**
   * Represents muster configuration for a given time window and all units.
   * This structure then can be queried for muster compliance.
   * Example of the structure:
   * <pre>
   {
      1: [{startTimestamp: 1, endTimestamp: 2}, {startTimestamp: 3, endTimestamp: 4}],
      2: [{startTimestamp: 5, endTimestamp: 6}],
    }
   * </pre>
   */
  toMusterTimeView(multipleUntisConfigurations: UnitMusterConfFromDb[], fromDate: any | moment.Moment, toDate: any | moment.Moment): MusterTimeView {

    console.log('============');
    console.log(fromDate);
    console.log(toDate);

    multipleUntisConfigurations.forEach(singleUntilConf => {
      const tsConfig = singleUntilConf.musterConf.map(mc => {

        const days = mc.days;
        const startTime = mc.startTime;
        const timezone = mc.timezone;
        const durationMinutes = mc.durationMinutes;

        console.log(days);

        return {};

      });

      console.log(tsConfig);

      const config: MusterTimeView = {};
      config[singleUntilConf.unitId] = [{startTimestamp: 1, endTimestamp: 2}];
      // console.log(config);

    });

    return {};

    // return {
    //   1: [{startTimestamp: 1, endTimestamp: 2}, {startTimestamp: 3, endTimestamp: 4}],
    //   2: [{startTimestamp: 5, endTimestamp: 6}],
    // };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static calculateMusterCompliance(
    observations: FilteredObservation[],
    unitsMusterConf: UnitMusterConfFromDb[],
    musterComplianceReport: IntermediateMusterCompliance[],
  ) : MusterCompliance[] {

    console.log(observations);
    console.log(JSON.stringify(unitsMusterConf));
    console.log(musterComplianceReport);

    return [];
  }

  private static toPageWithRowLimit(musterInfo: MusterCompliance[], page: number, limit: number): MusterCompliance[] {
    const offset = page * limit;
    return musterInfo.slice(offset, offset + limit);
  }

  toUnitMusterConf(musterUnitConf: UnitMusterConfFromDb[]): UnitMusterConf[] {
    return musterUnitConf.map(muConf => {
      const unitId = muConf.unitId;
      const musterConf = muConf.musterConf;
      const newMusterConf = musterConf.map(conf => {
        return {
          days: daysToString(conf.days),
          startTime: conf.startTime,
          timezone: conf.timezone,
          durationMinutes: conf.durationMinutes,
          reportId: conf.reportId,
        };
      });
      return {unitId, musterConf: newMusterConf};
    });


    return [];
  }
}

type UnitId = number;

type Edipi = string;

type FilteredObservation = {
  edipi: Edipi
  timestamp: string
};

export type UnitMusterConfFromDb = {
  unitId: UnitId
  musterConf: MusterConfiguration[]
};

export type UnitMusterConf = {
  unitId: UnitId
  musterConf: MusterConfWithDateArray[]
};

type IntermediateMusterCompliance = {
  edipi: Edipi
  firstName: string
  lastName: string
  myCustomColumn1: string,
  unitId: number
  phone: string
};

type MusterCompliance = {
  totalMusters: number
  mustersReported: number
  musterPercent: number
} & IntermediateMusterCompliance;

export type MusterTimeView = {
  [unitId: number]: {startTimestamp: number, endTimestamp: number}[]
};

export default new MusterPostgresCtr();
