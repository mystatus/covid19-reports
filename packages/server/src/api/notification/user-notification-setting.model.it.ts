import { expect } from 'chai';
import { seedOrgContact } from '../../util/test-utils/seed';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { seedUser } from '../user/user.model.mock';
import { seedNotification } from './notification.model.mock';
import { Notification } from './notification.model';
import { UserNotificationSetting } from './user-notification-setting.model';
import { seedUserNotificationSetting } from './user-notification-setting.model.mock';

describe(`UserNotificationSetting Model`, () => {
  describe(`cascades on delete`, () => {
    let org: Org;
    let user: User;
    let notification: Notification;
    let userNotificationSetting: UserNotificationSetting;

    beforeEach(async () => {
      ({ org } = await seedOrgContact());
      user = await seedUser();
      notification = await seedNotification();
      userNotificationSetting = await seedUserNotificationSetting(user, org, notification);
    });

    it(`user`, async () => {
      const settingExisting = await UserNotificationSetting.findOne(userNotificationSetting.id);
      expect(settingExisting).to.exist;

      await expect(user.remove()).to.be.fulfilled;

      const settingDeleted = await UserNotificationSetting.findOne(userNotificationSetting.id);
      expect(settingDeleted).not.to.exist;
    });

    it(`org`, async () => {
      const settingExisting = await UserNotificationSetting.findOne(userNotificationSetting.id);
      expect(settingExisting).to.exist;

      await expect(org.remove()).to.be.fulfilled;

      const settingDeleted = await UserNotificationSetting.findOne(userNotificationSetting.id);
      expect(settingDeleted).not.to.exist;
    });

    it(`notification`, async () => {
      const settingExisting = await UserNotificationSetting.findOne(userNotificationSetting.id);
      expect(settingExisting).to.exist;

      await expect(notification.remove()).to.be.fulfilled;

      const settingDeleted = await UserNotificationSetting.findOne(userNotificationSetting.id);
      expect(settingDeleted).not.to.exist;
    });
  });
});
