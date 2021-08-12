import { Observation } from '../../../api/observation/observation.model';
import { ReportSchema } from '../../../api/report-schema/report-schema.model';

export function observationTestData(userEdipi: string, unitName: string, reportSchema: ReportSchema, startDate: moment.Moment, endDate: moment.Moment): Observation[] {
  const currDate = startDate;
  const observations: Observation[] = [];

  let count: number = 0;
  while (currDate <= endDate) {
    const observation = Observation.create();
    observation.unit = unitName;
    observation.reportSchema = reportSchema;
    observation.timestamp = new Date(currDate.toISOString());
    observation.documentId = `DocumentId_${userEdipi}_${reportSchema.id}_${count}`;
    observation.edipi = userEdipi;
    observations.push(observation);
    currDate.add(1, 'day');
    count += 1;
  }

  return observations;
}
