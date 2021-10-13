import { UserSerialized } from './user.types';
import { UnitSerialized } from './unit.types';
import { RoleSerialized } from './role.types';

export type UserRoleSerialized = {
  id: number;
  user?: UserSerialized;
  role?: RoleSerialized;
  units?: UnitSerialized[];
  allUnits: boolean;
};
