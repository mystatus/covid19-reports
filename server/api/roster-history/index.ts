import express from 'express';
import multer from 'multer';
import path from 'path';
import controller from './roster-history.controller';
import {
  requireOrgAccess,
  requireRolePermission,
  requireRootAdmin,
} from '../../auth';

const rosterHistoryUpload = multer({
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
  '/:orgId/template',
  requireOrgAccess,
  requireRootAdmin,
  controller.getRosterHistoryTemplate,
);

router.post(
  '/:orgId/bulk',
  requireOrgAccess,
  requireRootAdmin,
  rosterHistoryUpload.single('roster_history_csv'),
  controller.uploadRosterHistory,
);

export default router;
