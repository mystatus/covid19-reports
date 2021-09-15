import { User } from '../../../api/user/user.model';
import { Org } from '../../../api/org/org.model';

export function orgTestData(admin: User, orgCount: number) {
  const org = Org.create({
    name: `Group ${orgCount}`,
    description: `Group ${orgCount} for testing.`,
    contact: admin,
    indexPrefix: `testgroup${orgCount}`,
    reportingGroup: `test${orgCount}`,
  });
  return org;
}
