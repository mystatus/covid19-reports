import express from 'express';
import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
import controller from './roster.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth';

const rosterUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
  }),
});

const router = express.Router() as any;

router.get(
  '/:orgId/column',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  controller.getFullRosterInfo,
);

router.post(
  '/:orgId/column',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.addCustomColumn,
);

router.put(
  '/:orgId/column/:columnName',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  bodyParser.json(),
  controller.updateCustomColumn,
);

router.delete(
  '/:orgId/column/:columnName',
  requireOrgAccess,
  requireRolePermission(role => role.canManageGroup),
  controller.deleteCustomColumn,
);

router.get(
  '/info/:edipi',
  requireInternalUser,
  controller.getRosterInfosForIndividual,
);

router.get(
  '/:orgId/template',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getRosterTemplate,
);

router.get(
  '/:orgId/info',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  controller.getRosterInfo,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  controller.getRoster,
);

router.post(
  '/:orgId/search',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  bodyParser.json(),
  controller.searchRoster,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  bodyParser.json(),
  // eslint-disable-next-line import/no-named-as-default-member
  controller.addRosterEntry,
);

router.post(
  '/:orgId/bulk',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  rosterUpload.single('roster_csv'),
  controller.uploadRosterEntries,
);

router.delete(
  '/:orgId/bulk',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.deleteRosterEntries,
);

router.get(
  '/:orgId/:rosterId',
  requireOrgAccess,
  requireRolePermission(role => role.canViewRoster),
  controller.getRosterEntry,
);

router.delete(
  '/:orgId/:rosterId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.deleteRosterEntry,
);

router.put(
  '/:orgId/:rosterId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  bodyParser.json(),
  controller.updateRosterEntry,
);

export default router;
