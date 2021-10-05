import _ from 'lodash';
import { Response } from 'express';
import moment from 'moment-timezone';
import {
  ApiRequest,
  OrgSettingParams,
} from '../api.router';
import { AccessRequest, AccessRequestStatus } from '../access-request/access-request.model';
import { Observation } from '../observation/observation.model';
import { Unit } from '../unit/unit.model';
import { UserNotificationSetting } from './user-notification-setting.model';
import { musterComplianceStatsByDateRange } from '../../util/muster-utils';
import { RosterHistory } from '../roster/roster-history.model';

type AlertData = { [key: string]: number };
type OutputRecord = {
  userSetting: UserNotificationSetting;
  alertData: AlertData;
};

class NotificationAlertController {

  // return the number of users per unit requesting medical attention
  async getUsersRequestingMedicalAttentionByUnit(req: ApiRequest<OrgSettingParams>, res: Response) {
    const output: OutputRecord[] = [];

    // first get all the users from the org who are registered for the given alert
    const userSettings = (await getUsersRegisteredForNotification(req.appOrg!.id, 'speakToSomeoneAlert'))
      .filter((setting: UserNotificationSetting) => {
        return isEligibleForNotification(setting);
      });

    const unitNameMap = await getUnitIDNameMap(req.appOrg!.id);

    // for each user we need to see if it is time to fire an alert and calculate the values
    for (const setting of userSettings) {
      const alertData: AlertData = {};
      const minutes = getMinutesSinceLastNotification(setting);
      const orgUserRole = setting.user!.userRoles!.find(userRole => userRole.role!.org!.id === req.appOrg!.id);
      if (!orgUserRole) {
        continue;
      }
      const queryBuilder = Observation.createQueryBuilder('observation')
        .select('COUNT(rh.unit_id) as count, rh.unit_id')
        .leftJoin(RosterHistory, 'rh', 'rh.id = observation.roster_history_entry_id')
        .where('observation.report_schema_org = :org', { org: req.appOrg!.id })
        .andWhere(`observation.report_schema_id = 'es6ddssymptomobs'`)
        .andWhere(`observation.custom_columns->>'TalkToSomeone' = 'true'`)
        .andWhere('observation.timestamp BETWEEN :minTime AND :maxTime', {
          minTime: moment().subtract(minutes, 'minutes'),
          maxTime: moment(),
        })
        .groupBy('rh.unit_id');
      if (!orgUserRole.allUnits) {
        queryBuilder
          .andWhere(`rh.unit_id IN (${orgUserRole.units.map(unit => unit.id).join(',')})`);
      }
      const rows = await queryBuilder.getRawMany();

      rows.forEach((row: any) => {
        // only add counts for units where the threshold is exceeded
        if (row.count >= setting.threshold && row.unit_id) {
          alertData[unitNameMap[row.unit_id]] = row.count;
        }
      });

      // only return records with actual alert data
      if (!_.isEmpty(alertData)) {
        output.push({
          userSetting: setting,
          alertData,
        });
      }
    }
    res.json(output);
  }

  // return the number of users per unit requiring immediate medical attention
  async getUsersRequiringMedicalAttentionByUnit(req: ApiRequest<OrgSettingParams>, res: Response) {
    const output: OutputRecord[] = [];

    // first get all the users from the org who are registered for the given alert
    const userSettings = (await getUsersRegisteredForNotification(req.appOrg!.id, 'medicalAttentionAlert'))
      .filter((setting: UserNotificationSetting) => {
        return isEligibleForNotification(setting);
      });

    const unitNameMap = await getUnitIDNameMap(req.appOrg!.id);

    // for each user we need to see if it is time to fire an alert and calculate the values
    for (const setting of userSettings) {
      const alertData: AlertData = {};
      const minutes = getMinutesSinceLastNotification(setting);
      const orgUserRole = setting.user!.userRoles!.find(userRole => userRole.role!.org!.id === req.appOrg!.id);
      if (!orgUserRole) {
        continue;
      }
      const queryBuilder = Observation.createQueryBuilder('observation')
        .select('COUNT(rh.unit_id) as count, rh.unit_id')
        .leftJoin(RosterHistory, 'rh', 'rh.id = observation.roster_history_entry_id')
        .where('observation.report_schema_org = :org', { org: req.appOrg!.id })
        .andWhere(`observation.report_schema_id = 'es6ddssymptomobs'`)
        .andWhere('observation.timestamp BETWEEN :minTime AND :maxTime', {
          minTime: moment().subtract(minutes, 'minutes'),
          maxTime: moment(),
        })
        .andWhere(
          `((observation.custom_columns->>'Score')::int >= 20
          OR (observation.custom_columns->>'TemperatureFahrenheit')::int >= 102
          OR LOWER(observation.custom_columns->>'Category') In (:...keywords))`,
          {
            keywords: ['medium', 'high', 'very high'],
          },
        )
        .groupBy('rh.unit_id');
      if (!orgUserRole.allUnits) {
        queryBuilder
          .andWhere(`rh.unit_id IN (${orgUserRole.units.map(unit => unit.id).join(',')})`);
      }
      const rows = await queryBuilder.getRawMany();

      rows.forEach((row: any) => {
        // only add counts for units where the threshold is exceeded
        if (row.count >= setting.threshold && row.unit_id) {
          alertData[unitNameMap[row.unit_id]] = row.count;
        }
      });

      // only return records with actual alert data
      if (!_.isEmpty(alertData)) {
        output.push({
          userSetting: setting,
          alertData,
        });
      }
    }
    res.json(output);
  }

  // return the number of symptoms per unit that are trending upwards or downwards over last 3 days
  async getNumTrendingSymptomsByUnit(req: ApiRequest<OrgSettingParams>, res: Response) {
    const output: OutputRecord[] = [];

    // first get all the users from the org who are registered for the given alert
    const userSettings = (await getUsersRegisteredForNotification(req.appOrg!.id, 'symptomTrendingAlert'))
      .filter((setting: UserNotificationSetting) => {
        return isEligibleForNotification(setting);
      });
    // each property of this type is a symptom name with an array of counts indexed by day
    type SymptomCountsByDay = { [key: string]: number[] };
    // each property of this type is a unit name with the symptom counts by day
    type UnitSymptomCounts = { [key: number]: SymptomCountsByDay };
    const unitSymptomCountsByDay: UnitSymptomCounts = {};
    const units = await Unit.find({
      relations: ['org'],
      where: { org: { id: req.appOrg!.id } },
    });

    // initialize the return object with all the units first
    units.forEach((unit: Unit) => {
      unitSymptomCountsByDay[unit.id] = {};
    });

    // make 3 queries for the past 3 days, iterating from past to recent
    const lookBackDays = 3;
    for (let lookBackIndex = lookBackDays; lookBackIndex > 0; lookBackIndex--) {
      const rows = await Observation.createQueryBuilder('observation')
        .select(`observation.custom_columns->>'Symptoms' as symptoms, rh.unit_id`)
        .leftJoin(RosterHistory, 'rh', 'rh.id = observation.roster_history_entry_id')
        .where('observation.report_schema_org = :org', { org: req.appOrg!.id })
        .andWhere(`observation.report_schema_id = 'es6ddssymptomobs'`)
        .andWhere('observation.timestamp BETWEEN :minTime AND :maxTime', {
          minTime: moment().subtract(lookBackIndex, 'days'),
          maxTime: moment().subtract(lookBackIndex - 1, 'days'),
        })
        .orderBy('rh.unit_id')
        .getRawMany();

      for (const row of rows) {
        // if the unit is unknown or there are no symptoms, skip this entry
        if (!unitSymptomCountsByDay[row.unit_id] || !row.symptoms) {
          continue;
        }

        // parse out the symptoms
        const symptoms = row.symptoms.split(',');
        for (let symptom of symptoms) {
          symptom = symptom.trim();
          // if this symptom has not been encountered for the unit yet we need initialize the count structure
          if (!unitSymptomCountsByDay[row.unit_id][symptom]) {
            // this array is ordered/indexed from past to recent
            unitSymptomCountsByDay[row.unit_id][symptom] = [0, 0, 0];
          }
          unitSymptomCountsByDay[row.unit_id][symptom][lookBackDays - lookBackIndex] += 1;
        }
      }
    }

    const numTrendingSymptomsByUnit: { [key: number]: number } = {};
    Object.keys(unitSymptomCountsByDay).forEach((unit: string) => {
      const unitId = parseInt(unit);
      numTrendingSymptomsByUnit[unitId] = 0;
      // iterate over the daily count of each symptom for the unit
      // if the symptom decreases or increases for every day then count
      // it as trending
      Object.keys(unitSymptomCountsByDay[unitId]).forEach((symptom: string) => {
        const symptomCountByDay = unitSymptomCountsByDay[unitId][symptom];
        let isIncreasingTrend = true;
        let isDecreasingTrend = true;
        for (let i = 0; i < symptomCountByDay.length; i++) {
          if (i > 0) {
            if (symptomCountByDay[i] >= symptomCountByDay[i - 1]) {
              isDecreasingTrend = false;
            }
            if (symptomCountByDay[i] <= symptomCountByDay[i - 1]) {
              isIncreasingTrend = false;
            }
          }
        }
        if (isIncreasingTrend || isDecreasingTrend) {
          numTrendingSymptomsByUnit[unitId] += 1;
        }
      });
    });

    const unitNameMap = await getUnitIDNameMap(req.appOrg!.id);

    for (const setting of userSettings) {
      const orgUserRole = setting.user!.userRoles!.find(userRole => userRole.role!.org!.id === req.appOrg!.id);
      if (!orgUserRole) {
        continue;
      }
      const alertData: AlertData = {};
      Object.keys(numTrendingSymptomsByUnit).forEach((unit: string) => {
        const unitId = parseInt(unit);
        // only add data exceeding threshold
        if (numTrendingSymptomsByUnit[unitId] >= setting.threshold
          && (orgUserRole.allUnits || orgUserRole.units.find(u => u.id === unitId))) {
          alertData[unitNameMap[unitId]] = numTrendingSymptomsByUnit[unitId];
        }
      });
      // only return records with actual alert data
      if (!_.isEmpty(alertData)) {
        output.push({
          userSetting: setting,
          alertData,
        });
      }
    }
    res.json(output);
  }

  // return the number of symptoms per unit that are trending upwards or downwards over last 3 days
  async getLowMusterRates(req: ApiRequest<OrgSettingParams>, res: Response) {
    const output: OutputRecord[] = [];

    const stats = await musterComplianceStatsByDateRange(
      req.appOrg!,
      req.appUserRole!,
      undefined,
      undefined,
      moment().subtract(1, 'day').startOf('day').valueOf(),
      moment().subtract(1, 'day').endOf('day').valueOf(),
    );

    const unitNameMap = await getUnitIDNameMap(req.appOrg!.id);

    // first get all the users from the org who are registered for the given alert
    const userSettings = (await getUsersRegisteredForNotification(req.appOrg!.id, 'musterAlert'))
      .filter((setting: UserNotificationSetting) => {
        return isEligibleForNotification(setting);
      });
    for (const setting of userSettings) {
      const orgUserRole = setting.user!.userRoles!.find(userRole => userRole.role!.org!.id === req.appOrg!.id);
      if (!orgUserRole) {
        continue;
      }
      const alertData: AlertData = {};
      for (const stat of stats) {
        // only add data exceeding threshold, compliance is expressed in normalized percentage (0.0-1.0)
        if (1.0 - stat.compliance >= setting.threshold / 100.0
          && (orgUserRole.allUnits || orgUserRole.units.find(unit => unit.id === stat.unit))) {
          alertData[unitNameMap[stat.unit]] = 1.0 - stat.compliance;
        }
      }
      // only return records with actual alert data
      if (!_.isEmpty(alertData)) {
        output.push({
          userSetting: setting,
          alertData,
        });
      }
    }
    res.json(output);
  }

  async getUserAccessRequests(req: ApiRequest<OrgSettingParams>, res: Response) {
    const output: OutputRecord[] = [];
    // first get all the users from the org who are registered for the given alert
    const userSettings = (await getUsersRegisteredForNotification(req.appOrg!.id, 'userAccessAlert'))
      .filter((setting: UserNotificationSetting) => {
        return isEligibleForNotification(setting);
      });

    const accessRequestCount = await AccessRequest.count({
      relations: ['org'],
      where: {
        status: AccessRequestStatus.Pending,
        org: { id: req.appOrg!.id },
      },
    });

    for (const setting of userSettings) {
      if (accessRequestCount >= setting.threshold) {
        output.push({
          userSetting: setting,
          alertData: {
            accessRequestCount,
          },
        });
      }
    }
    res.json(output);
  }

}

async function getUnitIDNameMap(orgId: number) {
  const units = await Unit.find({
    where: {
      org: orgId,
    },
  });

  const unitNameMap: { [key: number]: string } = {};
  units.forEach(unit => {
    unitNameMap[unit.id] = unit.name;
  });
  return unitNameMap;
}

// Calculate the number of minutes since the user last received a notification according to their settings
function getMinutesSinceLastNotification(setting: UserNotificationSetting): number {
  // default to returning 1 day ago
  let minutes = 24 * 60;
  if (setting.lastNotifiedDate) {
    minutes = moment().diff(moment(setting.lastNotifiedDate), 'minutes');
  }
  return minutes;
}

// Determine if a user should be notified based on their settings
function isEligibleForNotification(setting: UserNotificationSetting): boolean {
  return (getMinutesSinceLastNotification(setting) >= setting.minMinutesBetweenAlerts
    && (setting.dailyCount < setting.maxDailyCount || setting.maxDailyCount === 0));
}

async function getUsersRegisteredForNotification(orgId: number, notificationId: string) {
  return await UserNotificationSetting.find({
    relations: ['user', 'user.userRoles', 'user.userRoles.units', 'user.userRoles.role', 'user.userRoles.role.org', 'notification'],
    where: {
      notification: { id: notificationId },
      org: orgId,
    },
  });
}

export default new NotificationAlertController();
