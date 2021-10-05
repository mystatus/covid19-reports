import express from 'express';
import bodyParser from 'body-parser';
import alertController from './notification-alert.controller';
import controller from './notification.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth/auth-middleware';

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
  controller.getUserNotificationSettings,
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

router.get(
  '/:orgId/users-requesting-medical-attention',
  bodyParser.json(),
  requireInternalUser,
  requireOrgAccess,
  alertController.getUsersRequestingMedicalAttentionByUnit,
);

router.get(
  '/:orgId/users-requiring-medical-attention',
  bodyParser.json(),
  requireInternalUser,
  requireOrgAccess,
  alertController.getUsersRequiringMedicalAttentionByUnit,
);

router.get(
  '/:orgId/trending-symptoms',
  bodyParser.json(),
  requireInternalUser,
  requireOrgAccess,
  alertController.getNumTrendingSymptomsByUnit,
);

router.get(
  '/:orgId/low-muster-rates',
  bodyParser.json(),
  requireInternalUser,
  requireOrgAccess,
  alertController.getLowMusterRates,
);

router.get(
  '/:orgId/user-access-requests',
  bodyParser.json(),
  requireInternalUser,
  requireOrgAccess,
  alertController.getUserAccessRequests,
);

export default router;
