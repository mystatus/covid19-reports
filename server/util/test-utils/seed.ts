import {
  addUserToOrg,
  seedOrg,
} from '../../api/org/org.model.mock';
import {
  seedRoleBasicUser,
  seedRoleAdmin,
} from '../../api/role/role.model.mock';
import { seedUser } from '../../api/user/user.model.mock';

export async function seedOrgContactRoles() {
  const { org, contact } = await seedOrgContact();
  const roleAdmin = await seedRoleAdmin(org);
  const roleUser = await seedRoleBasicUser(org);
  await addUserToOrg(contact, roleAdmin);

  return {
    contact,
    org,
    roleAdmin,
    roleUser,
  };
}

export async function seedOrgContact() {
  const contact = await seedUser();
  const org = await seedOrg(contact);

  return {
    contact,
    org,
  };
}
