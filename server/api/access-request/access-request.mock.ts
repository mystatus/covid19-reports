import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { AccessRequest } from './access-request.model';

export async function seedAccessRequests(users: User[], org: Org) {
  const accessRequests = [] as AccessRequest[];
  for (const user of users) {
    const accessRequest = await seedAccessRequest(user, org);
    accessRequests.push(accessRequest);
  }
  return accessRequests;
}

export function seedAccessRequest(user: User, org: Org) {
  const accessRequest = new AccessRequest();
  accessRequest.user = user;
  accessRequest.org = org;
  accessRequest.requestDate = new Date();
  return accessRequest.save();
}
