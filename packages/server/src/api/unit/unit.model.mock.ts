import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { Unit } from './unit.model';

export function mockUnit(org: Org) {
  return Unit.create({
    org,
    name: uniqueString(),
    musterConfiguration: [],
  });
}

export function seedUnit(org: Org) {
  return mockUnit(org).save();
}

export function seedUnits(org: Org, options: {
  count: number;
}) {
  const { count } = options;
  const units = [] as Unit[];

  for (let i = 0; i < count; i++) {
    units.push(mockUnit(org));
  }

  return Unit.save(units);
}
