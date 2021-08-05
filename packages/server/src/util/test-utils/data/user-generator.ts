import { User } from '../../../api/user/user.model';
import { uniqueEdipi, uniquePhone } from '../unique';

export function adminUserTestData() {
  return User.create({
    edipi: uniqueEdipi(),
    firstName: 'Group',
    lastName: 'Admin',
    phone: uniquePhone(),
    email: `groupadmin@setest.com`,
    service: 'Space Force',
    isRegistered: true,
  });
}
