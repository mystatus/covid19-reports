import { UserRoleSerialized } from './user-role.types';

export type UserSerialized = {
  edipi: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  enabled?: boolean;
  rootAdmin?: boolean;
  isRegistered?: boolean;
  userRoles?: UserRoleSerialized[];
};
