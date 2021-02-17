import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';
import chaiArrays from 'chai-arrays';
import { AccessRequest } from './api/access-request/access-request.model';
import { UserNotificationSetting } from './api/notification/user-notification-setting.model';
import { Org } from './api/org/org.model';
import { Role } from './api/role/role.model';
import { CustomRosterColumn } from './api/roster/custom-roster-column.model';
import { RosterHistory } from './api/roster/roster-history.model';
import { Roster } from './api/roster/roster.model';
import { Unit } from './api/unit/unit.model';
import { UserRole } from './api/user/user-role.model';
import { User } from './api/user/user.model';
import { Notification } from './api/notification/notification.model';
import { WorkspaceTemplate } from './api/workspace/workspace-template.model';
import { Workspace } from './api/workspace/workspace.model';
import server from './app';

chai.use(chaiAsPromised);
chai.use(chaiSubset);
chai.use(chaiArrays);

before(async () => {
  await server;
});

beforeEach(async () => {
  try {
    // Clear every type of model manually without relying on cascades. This should run very efficiently to keep
    // the tests fast, and will also prevent any corrupted state if cascades aren't properly set up.
    await AccessRequest.delete({});
    await UserRole.delete({});
    await Role.delete({});
    await WorkspaceTemplate.delete({});
    await Workspace.delete({});
    await CustomRosterColumn.delete({});
    await Roster.delete({});
    await RosterHistory.delete({});
    await Unit.delete({});
    await UserNotificationSetting.delete({});
    await Notification.delete({});
    await Org.delete({});
    await User.delete({});
  } catch (err) {
    throw new Error(`Failed to clear database: ${err.message}`);
  }
});
