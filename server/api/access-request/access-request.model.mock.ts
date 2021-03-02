import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { AccessRequest } from './access-request.model';

export function mockAccessRequest(user: User, org: Org) {
  return AccessRequest.create({
    user,
    org,
    requestDate: new Date(),
  });
}

export function seedAccessRequest(user: User, org: Org) {
  return mockAccessRequest(user, org).save();
}

export function seedAccessRequests(users: User[], org: Org) {
  const accessRequests = [] as AccessRequest[];
  for (const user of users) {
    accessRequests.push(mockAccessRequest(user, org));
  }
  return AccessRequest.save(accessRequests);
}
