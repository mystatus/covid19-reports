import express from 'express';
import multer from 'multer';
import path from 'path';
import controller from './roster.controller';
import { requireInternalUser, requireOrgAccess, requireRolePermission } from '../../auth';

const rosterUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      console.log('destination');
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req: any, file: any, cb: any) => {
      console.log('filename');
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
  }),
});

const router = express.Router() as any;

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
  requireRolePermission(role => role.canManageRoster),
  controller.getRosterInfo,
);

router.get(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getRoster,
);

router.get(
  '/:orgId/count',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getRosterCount,
);

router.post(
  '/:orgId',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.addRosterEntry,
);

router.post(
  '/:orgId/bulk',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  rosterUpload.single('roster_csv'),
  controller.uploadRosterEntries,
);

router.get(
  '/:orgId/:edipi',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.getRosterEntry,
);

router.delete(
  '/:orgId/:edipi',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.deleteRosterEntry,
);

router.put(
  '/:orgId/:edipi',
  requireOrgAccess,
  requireRolePermission(role => role.canManageRoster),
  controller.updateRosterEntry,
);

export default router;
