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

    // for each user we need to see if it is time to fire an alert and calculate the values
    for (const setting of userSettings) {
      const alertData: AlertData = {};
      const minutes = getMinutesSinceLastNotification(setting);
      const rows = await Observation.createQueryBuilder('observation')
        .select('COUNT(observation.unit) as count, observation.unit')
        .where('observation.report_schema_org = :org', { org: req.appOrg!.id })
        .andWhere(`observation.report_schema_id = 'es6ddssymptomobs'`)
        .andWhere(`observation.custom_columns->>'TalkToSomeone' = 'true'`)
        .andWhere('observation.timestamp BETWEEN :minTime AND :maxTime', {
          minTime: moment().subtract(minutes, 'minutes'),
          maxTime: moment(),
        })
        .groupBy('observation.unit')
        .getRawMany();
      console.log(rows);
      rows.forEach((row: any) => {
        // only add counts for units where the threshold is exceeded
        if (row.count >= setting.threshold) {
          alertData[row.unit] = row.count;
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

    // for each user we need to see if it is time to fire an alert and calculate the values
    for (const setting of userSettings) {
      const alertData: AlertData = {};
      const minutes = getMinutesSinceLastNotification(setting);
      const rows = await Observation.createQueryBuilder('observation')
        .select('COUNT(observation.unit) as count, observation.unit')
        .where('observation.report_schema_org = :org', { org: req.appOrg!.id })
        .andWhere(`observation.report_schema_id = 'es6ddssymptomobs'`)
        .andWhere('observation.timestamp BETWEEN :minTime AND :maxTime', {
          minTime: moment().subtract(minutes, 'minutes'),
          maxTime: moment(),
        })
        .andWhere(
          `((observation.custom_columns->>'Score')::int >= 20 
          OR (observation.custom_columns->>'TemperatureFahrenheit')::int >= 102
          OR observation.custom_columns->>'Category' In (:...keywords))`,
          {
            keywords: ['medium', 'high', 'very High'],
          },
        )
        .groupBy('observation.unit')
        .getRawMany();
      rows.forEach((row: any) => {
        // only add counts for units where the threshold is exceeded
        if (row.count >= setting.threshold) {
          alertData[row.unit] = row.count;
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
    type UnitSymptomCounts = { [key: string]: SymptomCountsByDay };
    const unitSymptomCountsByDay: UnitSymptomCounts = {};
    const units = await Unit.find({
      select: ['name'],
      relations: ['org'],
      where: { org: { id: req.appOrg!.id } },
    });

    // initialize the return object with all the units first
    units.forEach((unit: Unit) => {
      unitSymptomCountsByDay[unit.name] = {};
    });

    // make 3 queries for the past 3 days, iterating from past to recent
    const lookBackDays = 3;
    for (let lookBackIndex = lookBackDays; lookBackIndex > 0; lookBackIndex--) {
      const rows = await Observation.createQueryBuilder('observation')
        .select(`observation.custom_columns->>'Symptoms' as symptoms, observation.unit`)
        .where('observation.report_schema_org = :org', { org: req.appOrg!.id })
        .andWhere(`observation.report_schema_id = 'es6ddssymptomobs'`)
        .andWhere('observation.timestamp BETWEEN :minTime AND :maxTime', {
          minTime: moment().subtract(lookBackIndex, 'days'),
          maxTime: moment().subtract(lookBackIndex - 1, 'days'),
        })
        .orderBy('observation.unit')
        .getRawMany();

      for (const row of rows) {
        // if the unit is unknown or there are no symptoms, skip this entry
        if (!unitSymptomCountsByDay[row.unit] || !row.symptoms) {
          continue;
        }

        // parse out the symptoms
        const symptoms = row.symptoms.split(',');
        for (let symptom of symptoms) {
          symptom = symptom.trim();
          // if this symptom has not been encountered for the unit yet we need initialize the count structure
          if (!unitSymptomCountsByDay[row.unit][symptom]) {
            // this array is ordered/indexed from past to recent
            unitSymptomCountsByDay[row.unit][symptom] = [0, 0, 0];
          }
          unitSymptomCountsByDay[row.unit][symptom][lookBackDays - lookBackIndex] += 1;
        }
      }
    }

    const numTrendingSymptomsByUnit: { [key: string]: number } = {};
    Object.keys(unitSymptomCountsByDay).forEach((unit: string) => {
      numTrendingSymptomsByUnit[unit] = 0;
      // iterate over the daily count of each symptom for the unit
      // if the symptom decreases or increases for every day then count
      // it as trending
      Object.keys(unitSymptomCountsByDay[unit]).forEach((symptom: string) => {
        const symptomCountByDay = unitSymptomCountsByDay[unit][symptom];
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
          numTrendingSymptomsByUnit[unit] += 1;
        }
      });
    });

    for (const setting of userSettings) {
      const alertData: AlertData = {};
      Object.keys(numTrendingSymptomsByUnit).forEach((unit: string) => {
        // only add data exceeding threshold
        if (numTrendingSymptomsByUnit[unit] >= setting.threshold) {
          alertData[unit] = numTrendingSymptomsByUnit[unit];
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
    res.json(numTrendingSymptomsByUnit);
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

    // first get all the users from the org who are registered for the given alert
    const userSettings = (await getUsersRegisteredForNotification(req.appOrg!.id, 'musterAlert'))
      .filter((setting: UserNotificationSetting) => {
        return isEligibleForNotification(setting);
      });
    for (const setting of userSettings) {
      const alertData: AlertData = {};
      for (const stat of stats) {
        // only add data exceeding threshold, compliance is expressed in normalized percentage (0.0-1.0)
        if (1.0 - stat.compliance >= setting.threshold / 100.0) {
          alertData[stat.unit] = 1.0 - stat.compliance;
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
    relations: ['user', 'notification'],
    where: {
      notification: { id: notificationId },
      org: orgId,
    },
  });
}

export default new NotificationAlertController();
