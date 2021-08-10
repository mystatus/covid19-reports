import moment from 'moment-timezone';
import { Observation } from './observation.model';
import { Log } from '../../util/log';

export async function getObservations(edipis: string[], fromDate: moment.Moment, toDate: moment.Moment): Promise<RecordedObservations[] | any[]> {
  Log.info(`getObservations() for edipis ${edipis} & dates ${fromDate} - ${toDate}`);

  const observations = await Observation.createQueryBuilder('observation')
    .select('observation.edipi, observation.timestamp')
    .andWhere(`observation.timestamp between :fromDate and :toDate`, { fromDate, toDate })
    .andWhere(`observation.edipi IN (:...edipis)`, { edipis })
    .getRawMany();

  Log.info(`getObservations() returned: ${JSON.stringify(observations)}`);
  return observations;
}

export type RecordedObservations = {
  edipi: string;
} & RecordedObservationTimestamp;

export type RecordedObservationTimestamp = {
  timestamp: Date;
};
