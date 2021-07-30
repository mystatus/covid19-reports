import moment from 'moment-timezone';
import { Observation } from './observation.model';

export function getObservations(edipis: string[], fromDate: moment.Moment, toDate: moment.Moment): Promise<RecordedObservations[]> {
  return Observation.createQueryBuilder('observation')
    .select('observation.edipi, observation.timestamp')
    .where('observation.timestamp <= to_timestamp(:tsTo)', { tsTo: toDate.unix() })
    .andWhere('observation.timestamp >= to_timestamp(:tsFrom)', { tsFrom: fromDate.unix() })
    .andWhere('observation.edipi IN (:...edipis)', { edipis })
    .getRawMany();
}

export type RecordedObservations = {
  edipi: string;
  timestamp: string;
};
