import { Response } from 'express';
import moment, { Moment } from 'moment-timezone';
import { In } from 'typeorm';
import later from 'later';
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

    const rosters = await this.getRosters(unitId, orgId);
    const unitIds = this.getUnitIds(rosters);
    const edipis = this.getEdipi(rosters);
    const musterUnitConf = await this.getMusterUnitConf(unitIds);
    const unitsMusterConfFromDb = await this.setDefaultMusterConf(musterUnitConf, orgId);
    const observations = await this.getObservations(edipis, fromDate, toDate);
    // TODO: move code into toMusterIntermediateCompliance
    const musterIntermediateCompliance = rosters.map(roster => this.toMusterIntermediateCompliance(roster));
    const unitsMusterConf = this.toUnitMusterConf(unitsMusterConfFromDb);
    const musterTimeView = this.toMusterTimeView(unitsMusterConf, fromDate, toDate);
    console.log(JSON.stringify(musterTimeView));
    const musterCompliance = this.calculateMusterCompliance(observations, unitsMusterConfFromDb, musterIntermediateCompliance);

    return res.json({
      rows: this.toPageWithRowLimit(musterCompliance, pageNumber, rowLimit),
      totalRowsCount: musterIntermediateCompliance.length,
    });
  }

  /** Get an array of unique Unit IDs */
  private getUnitIds(rosters: Roster[]): number[] {
    return Array.from(new Set(rosters.map(r => r.unit.id)));
  }

  /** Get an array of unique edipis */
  private getEdipi(rosters: Roster[]): string[] {
    return Array.from(new Set(rosters.map(r => r.edipi)));
  }

  private async getRosters(unitId: number, orgId: number): Promise<Roster[]> {
    let rosters;
    if (unitId) {
      rosters = await Roster.find({ relations: ['unit', 'unit.org'], where: { unit: unitId } });
    } else {
      rosters = await Roster.find({ relations: ['unit', 'unit.org'] });
    }
    return rosters.filter(roster => roster.unit.org!.id === orgId);
  }

  private async getMusterUnitConf(unitIds: number[]): Promise<UnitMusterConfFromDb[]> {
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
  private async setDefaultMusterConf(musterUnitConf: UnitMusterConfFromDb[], orgId: number): Promise<UnitMusterConfFromDb[]> {
    if (this.isMusterConfMissing(musterUnitConf)) {
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

  private isMusterConfMissing(musterUnitConf: UnitMusterConfFromDb[]): boolean {
    const confWithMissingMusterConf = musterUnitConf.filter(conf => !conf.musterConf || conf.musterConf.length === 0);
    return confWithMissingMusterConf.length > 0;
  }

  private toMusterIntermediateCompliance(roster: Roster): IntermediateMusterCompliance {
    return {
      edipi: roster.edipi,
      firstName: roster.firstName,
      lastName: roster.lastName,
      myCustomColumn1: 'tbd',
      unitId: roster.unit.id,
      phone: roster.phoneNumber,
    };
  }

  private async getObservations(edipis: Edipi[], fromDate: any | moment.Moment, toDate: any | moment.Moment) : Promise<FilteredObservation[]> {
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
  toMusterTimeView(multipleUnitsConfigurations: UnitMusterConf[], fromDate: any, toDate: any): MusterUnitTimeView {

    const rsp: MusterUnitTimeView = {};

    multipleUnitsConfigurations.forEach(singleUntilConfigurations => {
      const musterTimeView = singleUntilConfigurations.musterConf.map(suc => {
        return this.toSingleMusterTimeView(suc, fromDate, toDate);
      });
      rsp[singleUntilConfigurations.unitId] = musterTimeView.flat(1);
    });
    return rsp;
  }

  private calculateMusterCompliance(
    observations: FilteredObservation[],
    unitsMusterConf: UnitMusterConfFromDb[],
    musterComplianceReport: IntermediateMusterCompliance[],
  ) : MusterCompliance[] {

    console.log(observations);
    console.log(JSON.stringify(unitsMusterConf));
    console.log(musterComplianceReport);

    return [];
  }

  private toPageWithRowLimit(musterInfo: MusterCompliance[], page: number, limit: number): MusterCompliance[] {
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

  /**
   * Converts single muster configuration to a time muster window view structure. Time muster windows are generated from
   *  the provided start date until the end date. An example of a single muster configuration:
   * <pre>
   * {
   *    days: [2, 3],
   *     startTime: '13:00',
   *     timezone: 'America/Chicago',
   *     durationMinutes: 60,
   *     reportId: 'es6ddssymptomobs',
   *   };
   *  </pre>
   *
   * An example of an output:
   * <pre>
   *  [
   *  {
   *   startMusterDate: Moment<2021-07-05T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-05T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-12T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-12T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-19T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-19T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-26T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-26T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-06T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-06T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-13T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-13T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-20T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-20T19:00:00Z>
   * },
   *  {
   *   startMusterDate: Moment<2021-07-27T18:00:00Z>,
   *   endMusterDate: Moment<2021-07-27T19:00:00Z>
   * }
   *  ]
   *
   * </pre>
   *
   * @param musterConf muster configuration
   * @param fromDate start date for the generation of time muster windows
   * @param toDate end date for the generation of time muster windows
   */
  toSingleMusterTimeView(
    musterConf: MusterConfWithDateArray,
    fromDate: moment.Moment,
    toDate: moment.Moment,
  ): MusterTimeView[] {

    const {days, startTime, timezone, durationMinutes} = musterConf;
    const startDatesMusterSchedules = this.getMusterStartDatesSchedules(startTime, timezone, days, fromDate, toDate);
    return this.getMusterTimeViewWithEndTimes(startDatesMusterSchedules, durationMinutes);
  }

  private getMusterStartDatesSchedules(startTime: string, timezone: string, days: number[], fromDate: moment.Moment, toDate: moment.Moment) {
    const hoursMinutes = this.getHoursMinutes(startTime, timezone);
    const startDaysSchedule = days.map(day => {
      return later.parse.recur()
        .on(day)
        .dayOfWeek()
        .on(parseInt(hoursMinutes.hours))
        .hour()
        .on(parseInt(hoursMinutes.minutes))
        .minute();
    });
    return startDaysSchedule.map(sch => {
      // 10000 is number of instances to return. It is large enough to return all instances we need
      const allSchedules = later.schedule(sch).next(10000, fromDate.toDate(), toDate.toDate());
      // @ts-ignore next() does return zero value when no schedule is found for the given date range
      if (allSchedules === 0) {
        return [];
      }
      if (!Array.isArray(allSchedules)) {
        return [allSchedules];
      }
      return allSchedules;
    });
  }

  private getHoursMinutes(startTime: string, timezone: string): HoursAndMinutes {
    const split = moment.tz(startTime, 'HH:mm', timezone)
      .utc()
      .format('HH:mm')
      .split(':');
    return {hours: split[0], minutes: split[1]};
  }

  private getMusterTimeViewWithEndTimes(musterTimeViewWithEndTimes: Date[][], durationMinutes: number): MusterTimeView[] {

    const musterTimeView: MusterTimeView[] = [];

    musterTimeViewWithEndTimes.forEach(dateArray => {
      dateArray.forEach((dateElement: Date) => {
        musterTimeView.push({
          startMusterDate: moment.utc(dateElement),
          endMusterDate: moment.utc(dateElement).add({minutes: durationMinutes}),
        });
      });
    });

    return musterTimeView;
  }
}

export type MusterTimeView = {
  startMusterDate: Moment
  endMusterDate: Moment
};

type HoursAndMinutes = {
  hours: string
  minutes: string
};

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

export type MusterUnitTimeView = {
  [unitId: number]: MusterTimeView[]
};

export type UnitTimeView = {
  startTimestamp: number, endTimestamp: number
};

export default new MusterPostgresCtr();
