import {
  MusterConfiguration,
  MusterConfWithDateArray,
  binaryDaysToDateArray,
} from '@covid19-reports/shared';
import { In } from 'typeorm';
import { Unit } from '../unit/unit.model';
import { Org } from '../org/org.model';

/**
 * The <strong><code>getUnitMusterConfiguration()</code></strong> function <strong> returns muster configurations
 * for the given organization and list of units in the organization</strong>.
 *
 * @param orgId The organization ID
 * @param unitIds The array of units
 */
export async function getUnitMusterConfiguration(orgId: number, unitIds: number[]) {
  return toUnitMusterConf(await getMusterUnitConf(unitIds, await getDefaultMusterConf(orgId)));
}

/**
 * The <strong><code>getDefaultMusterConf()</code></strong> function <strong>returns a default muster configuration
 * for a given organization</strong>.
 *
 * @param orgId The organization ID
 */
async function getDefaultMusterConf(orgId: number): Promise<MusterConfiguration[]> {
  const org = await Org.findOne({ where: { id: orgId } });
  return org ? org.defaultMusterConfiguration : [];
}

/**
 * The <strong><code>getMusterUnitConf()</code></strong> function <strong> returns muster configurations for the given
 * list of units</strong>.
 * When a unit is missing a muster configuration a default one is provided instead.
 *
 * @param unitIds The array of units
 * @param defaultMusterConf The default muster configuration
 */
async function getMusterUnitConf(unitIds: number[], defaultMusterConf: MusterConfiguration[]): Promise<UnitMusterConfFromDb[]> {
  return (await Unit.find({ where: { id: In(unitIds) } })).map(unitConf => {
    return {
      unitId: unitConf.id,
      musterConf: !unitConf.musterConfiguration || unitConf.musterConfiguration.length === 0 ? defaultMusterConf : unitConf.musterConfiguration,
    };
  });
}

/**
 * The <strong><code>toUnitMusterConf()</code></strong> function <strong>converts muster configuration with units
 * where binary dates are converted to an array of dates</strong>.
 *
 * See <strong><code>binaryDaysToDateArray()</code></strong> for details.
 *
 * @param musterUnitConf
 */
export function toUnitMusterConf(musterUnitConf: UnitMusterConfFromDb[]): UnitMusterConf[] {
  return musterUnitConf.map(muConf => {
    const newMusterConf = muConf.musterConf.map(conf => {
      return {
        ...conf,
        days: binaryDaysToDateArray(conf.days),
      };
    });
    return {
      unitId: muConf.unitId,
      musterConf: newMusterConf,
    };
  });
}

export type UnitMusterConfFromDb = {
  unitId: number;
  musterConf: MusterConfiguration[];
};

export type UnitMusterConf = {
  unitId: number;
  musterConf: MusterConfWithDateArray[];
};
