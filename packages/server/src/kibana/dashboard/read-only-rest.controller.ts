import { Response, NextFunction } from 'express';
import { ApiRequest } from '../../api/api.router';
import { User } from '../../api/user/user.model';
import { UserRole } from '../../api/user/user-role.model';
import { Workspace } from '../../api/workspace/workspace.model';
import config from '../../config';
import { getKibanaRoles } from '../../util/kibana-utils';
import { Log } from '../../util/log';

const nJwt = require('njwt');

class ReadOnlyRestController {

  // Redirects user to Kibana login page. By attaching the rorJWT this will effectively log in the user seamlessly,
  // and store rorCookie in the browser.
  login(req: ApiRequest<null, null, LoginQuery>, res: Response) {
    Log.info('ror login()');

    const rorJwt = buildJWT(req.appUser, req.appUserRole!, req.appWorkspace!);
    Log.info('ror jwt', rorJwt);

    res.cookie('orgId', req.appOrg!.id, { httpOnly: true });
    res.cookie('workspaceId', req.appWorkspace!.id, { httpOnly: true });

    let url = `${config.kibana.basePath}/login?jwt=${rorJwt}`;
    if (req.query.dashboardUuid) {
      url += `#/dashboard/${req.query.dashboardUuid}`;
    }

    return res.redirect(url);
  }

  // Logs out of a Kibana session by clearing the rorCookie.
  logout(req: ApiRequest, res: Response, next: NextFunction) {
    Log.info('ror logout()');

    res.clearCookie('rorCookie');
    res.clearCookie('orgId');
    next();
  }

}

// Builds ReadOnlyRest JWT token.
export function buildJWT(user: User, userRole: UserRole, workspace: Workspace) {
  Log.info('ror buildJWT()');

  const claims = {
    sub: user.edipi,
    iss: 'https://statusengine.mysymptoms.mil',
    roles: getKibanaRoles(userRole),
    workspace_id: `${workspace!.id}`,
  };

  Log.info('ror claims', claims);

  const jwt = nJwt.create(claims, config.ror.secret);
  jwt.setExpiration(new Date().getTime() + (86400 * 1000 * 30)); // 30d

  return jwt.compact();
}

type LoginQuery = {
  dashboardUuid?: string;
};

export default new ReadOnlyRestController();
