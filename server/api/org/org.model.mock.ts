import { uniqueString } from '../../util/test-utils/unique';
import { Role } from '../role/role.model';
import { UserRole } from '../user/user-role.model';
import { User } from '../user/user.model';
import { Org } from './org.model';

export async function seedOrg(contact: User) {
  const org = Org.create({
    name: uniqueString(),
    description: uniqueString(),
    contact,
    indexPrefix: uniqueString(),
    defaultMusterConfiguration: [],
  });
  return Org.save(org);
}

export async function addUserToOrg(user: User, role: Role, indexPrefix = '*') {
  const userRole = UserRole.create({
    user,
    role,
    indexPrefix,
  });
  return userRole.save();
}
