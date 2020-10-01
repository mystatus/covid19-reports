import { PermissionSet } from './permission-set';

export class AllowedNotificationEvents extends PermissionSet {
  accessRequest: boolean = false;
}

export const NotificationEventDisplayName = {
  accessRequest: 'Access Requests',
};
