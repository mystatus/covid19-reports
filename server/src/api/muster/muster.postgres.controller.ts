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

    // TODO move these to Roster "package"
    const rostersFromDb = await this.getRosters(unitId, orgId);
    const unitIds = this.getUnitIds(rostersFromDb);
    const edipis = this.getEdipi(rostersFromDb);

    // TODO move these to Muster "package"
    const defaultMusterConf = await this.getDefaultMusterConf(orgId);
    const musterConfFromDb = await this.getMusterUnitConf(unitIds, defaultMusterConf);
    const unitsMusterConf = this.toUnitMusterConf(musterConfFromDb);
    const musterTimeView = this.toMusterTimeView(unitsMusterConf, fromDate, toDate);

    // TODO move to Observation "package"
    const observations = await this.getObservations(edipis, fromDate, toDate);

    // TODO move to Muster Compliance
    const musterIntermediateCompliance = this.toMusterIntermediateCompliance(rostersFromDb);
    const musterCompliance = this.calculateMusterCompliance(observations, musterTimeView, musterIntermediateCompliance);

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

  private async getMusterUnitConf(unitIds: number[], defaultMusterConf: MusterConfiguration[]): Promise<UnitMusterConfFromDb[]> {
    return (await Unit.find({ where: { id: In(unitIds) } })).map(unitConf => {
      return {
        unitId: unitConf.id,
        musterConf: !unitConf.musterConfiguration || unitConf.musterConfiguration.length === 0 ? defaultMusterConf : unitConf.musterConfiguration,
      };
    });
  }

  private async getDefaultMusterConf(orgId: number): Promise<MusterConfiguration[]> {
    const org = await Org.findOne({ where: { id: orgId } });
    return org ? org.defaultMusterConfiguration : [];
  }

  private toMusterIntermediateCompliance(rosters: Roster[]): IntermediateMusterCompliance[] {
    return rosters.map(roster => {
      return {
        edipi: roster.edipi,
        firstName: roster.firstName,
        lastName: roster.lastName,
        myCustomColumn1: 'tbd',
        unitId: roster.unit.id,
        phone: roster.phoneNumber,
      };
    });
  }

  private async getObservations(edipis: Edipi[], fromDate: any | moment.Moment, toDate: any | moment.Moment) : Promise<FilteredObservation[]> {
    return Observation.createQueryBuilder('observation')
      .select('observation.edipi, observation.timestamp')
      .where('observation.timestamp <= to_timestamp(:tsTo)', {tsTo: toDate.unix()})
      .andWhere('observation.timestamp >= to_timestamp(:tsFrom)', {tsFrom: fromDate.unix()})
      .andWhere('observation.edipi IN (:...edipis)', {edipis})
      .getRawMany();
  }

  /**
   * Represents muster configuration for a given time window and all units.
   * This structure then can be queried for muster compliance.
   * Example of the structure for two units, A and B:
   * <pre>
   {
      unitIdA: [{startMusterDate: Moment, endMusterDate: Moment}, {startMusterDate: Moment, endMusterDate: Moment}],
      unitIdB: [{startMusterDate: Moment, endMusterDate: Moment}],
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    observations: FilteredObservation[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unitsMusterConf: MusterUnitTimeView,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    musterComplianceReport: IntermediateMusterCompliance[],
  ) : MusterCompliance[] {
    // TODO continue...
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
      // next() is weird, it returns an non-array object when only one schedule is returned
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
  phone?: string
};

type MusterCompliance = {
  totalMusters: number
  mustersReported: number
  musterPercent: number
} & IntermediateMusterCompliance;

export type MusterUnitTimeView = {
  [unitId: number]: MusterTimeView[]
};

export default new MusterPostgresCtr();
