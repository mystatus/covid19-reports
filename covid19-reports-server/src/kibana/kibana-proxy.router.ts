import { Request, Response, Router } from 'express';
import proxy from 'http-proxy-middleware';
import kibanaProxySettings from './kibana-proxy-settings';
import { requireOrgAccess, requireWorkspaceAccess } from '../auth/auth-middleware';

const router = Router();

// swallow kibana manifest requests, they do not provide an org cookie and will fail authentication
router.use(
  `/ui/favicons/manifest.json`,
  (req: Request, res: Response) => {
    res.json({});
  },
);

// Proxy covid19-reports-client browser to Kibana
router.use(
  '*',
  requireOrgAccess,
  requireWorkspaceAccess,
  proxy(kibanaProxySettings),
);

export default router;
