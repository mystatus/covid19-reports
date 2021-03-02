import { Role } from '../role/role.model';
import { UserRole } from './user-role.model';
import { User } from './user.model';

export function mockUserRole(user: User, role: Role, options?: {
  customData?: Partial<UserRole>
}) {
  const { customData } = options ?? {};

  return UserRole.create({
    user,
    role,
    allUnits: true,
    ...customData,
  });
}

export function seedUserRole(user: User, role: Role, options?: {
  customData?: Partial<UserRole>
}) {
  return mockUserRole(user, role, options).save();
}
