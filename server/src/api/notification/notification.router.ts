import express from 'express';
import bodyParser from 'body-parser';
import controller from './notification.controller';
import { requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';

const router = express.Router() as any;

router.get(
  '/:orgId',
  requireOrgAccess,
  controller.getAvailableNotifications,
);

router.get(
  '/:orgId/all',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.getAllNotifications,
);

router.get(
  '/:orgId/setting',
  requireOrgAccess,
  controller.getUserNotificationSettings,
);

router.post(
  '/:orgId/setting',
  bodyParser.json(),
  requireOrgAccess,
  controller.addUserNotificationSetting,
);

router.get(
  '/:orgId/setting/:settingId',
  requireOrgAccess,
  controller.getUserNotificationSetting,
);

router.delete(
  '/:orgId/setting/:settingId',
  requireOrgAccess,
  controller.deleteUserNotificationSetting,
);

router.put(
  '/:orgId/setting/:settingId',
  bodyParser.json(),
  requireOrgAccess,
  controller.updateUserNotificationSetting,
);


export default router;
