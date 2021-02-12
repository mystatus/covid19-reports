import { Role } from '../role/role.model';
import { UserRole } from './user-role.model';
import { User } from './user.model';

export async function seedUserRole(user: User, role: Role) {
  const userRole = UserRole.create({
    user,
    role,
  });
  return userRole.save();
}
