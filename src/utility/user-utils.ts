import { ApiUser } from '../models/api-response';
import { LocalStorageState } from '../reducers/local-storage.reducer';
import { UserState } from '../reducers/user.reducer';

export function getLoggedInState(user: ApiUser, localStorage: LocalStorageState): Partial<UserState> {
  const roles = user.roles ?? [];
  const restoredActiveRole = roles?.find(role => role.org?.id === localStorage.orgId);
  return {
    ...user,
    roles,
    activeRole: restoredActiveRole ?? roles[0],
    isLoggedIn: true,
  };
}
