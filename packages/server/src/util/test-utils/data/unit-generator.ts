import { Org } from '../../../api/org/org.model';
import { Unit } from '../../../api/unit/unit.model';

/**
 * Creates Unit test data
 *
 * @param numUnits The number of units to create
 * @param unitsNameStartIndex The starting index for unit names.
 * For example for the value 2 the first unit crated would be called Unit 2
 * @param org The organization the units belong to
 */
export function unitsTestData(numUnits: number, unitsNameStartIndex: number, org: Org) {
  const units: Unit[] = [];

  for (let i = 1; i <= numUnits; i++) {
    const unit = Unit.create({
      org,
      name: `Unit ${unitsNameStartIndex}`,
    });
    units.push(unit);
    unitsNameStartIndex += 1;
  }
  return units;
}
