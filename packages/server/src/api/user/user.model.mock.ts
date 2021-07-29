import {
  uniqueEdipi,
  uniqueEmail,
  uniquePhone,
  uniqueString,
} from '../../util/test-utils/unique';
import { User } from './user.model';

export function mockUser(userData?: Partial<User>) {
  return User.create({
    edipi: uniqueEdipi(),
    firstName: uniqueString(),
    lastName: uniqueString(),
    phone: uniquePhone(),
    email: uniqueEmail(),
    service: uniqueString(),
    enabled: true,
    rootAdmin: false,
    isRegistered: true,
    ...userData,
  });
}

export function seedUsers(options: {
  count: number;
}) {
  const { count } = options;
  const users = [] as User[];

  for (let i = 0; i < count; i++) {
    users.push(mockUser());
  }

  return User.save(users);
}

export function seedUser(customData?: Partial<User>) {
  return mockUser(customData).save();
}

export function seedUserInternal() {
  return User.internal().save();
}
