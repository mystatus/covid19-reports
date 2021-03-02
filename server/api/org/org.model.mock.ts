import { uniqueString } from '../../util/test-utils/unique';
import { User } from '../user/user.model';
import { Org } from './org.model';

export function mockOrg(contact: User) {
  return Org.create({
    name: uniqueString(),
    description: uniqueString(),
    contact,
    indexPrefix: uniqueString(),
    defaultMusterConfiguration: [],
  });
}

export function seedOrg(contact: User) {
  return mockOrg(contact).save();
}
