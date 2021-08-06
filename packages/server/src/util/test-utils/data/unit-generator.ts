import { Org } from '../../../api/org/org.model';
import { ReportSchema } from '../../../api/report-schema/report-schema.model';
import { Unit } from '../../../api/unit/unit.model';

/**
 * Creates Unit test data
 *
 * @param numUnits The number of units to create
 * @param unitsNameStartIndex The starting index for unit names.
 * For example for the value 2 the first unit crated would be called Unit 2
 * @param org The organization the units belong to
 * @param reportSchemas The report schema for the units
 */
export function unitsTestData(numUnits: number, unitsNameStartIndex: number, org: Org, reportSchemas: ReportSchema[]) {
  const units: Unit[] = [];

  for (let i = 1; i <= numUnits; i++) {
    const unit = Unit.create({
      org,
      name: `Unit ${unitsNameStartIndex}`,
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
    unitsNameStartIndex += 1;
  }
  return units;
}
