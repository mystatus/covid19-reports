import { Org } from '../../../api/org/org.model';
import { ReportSchema } from '../../../api/report-schema/report-schema.model';
import { Unit } from '../../../api/unit/unit.model';

export function unitsTestData(numUnits: number, org: Org, reportSchemas: ReportSchema[]) {
  const units: Unit[] = [];
  let unitCount = 0;

  for (let i = 1; i <= numUnits; i++) {
    unitCount += 1;
    const unit = Unit.create({
      org,
      name: `Unit ${unitCount}`,
      musterConfiguration: [
        {
          days: 62,
          startTime: '00:00',
          timezone: 'America/Los_Angeles',
          durationMinutes: 120,
          reportId: reportSchemas[0].id,
        },
        {
          startTime: '2020-01-02T02:00:00.000',
          timezone: 'America/Los_Angeles',
          durationMinutes: 120,
          reportId: reportSchemas[1].id,
        },
      ],
      includeDefaultConfig: true,
    });
    units.push(unit);
  }
  return units;
}
