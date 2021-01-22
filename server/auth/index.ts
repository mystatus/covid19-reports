import { Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import { ApiRequest } from '../api';
import { User } from '../api/user/user.model';
import { Role } from '../api/role/role.model';
import {
  BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError,
} from '../util/error-types';
import { Org } from '../api/org/org.model';

const sslHeader = 'ssl-client-subject-dn';
const internalAccessHeader = 'status-engine-internal-access-key';

export async function requireUserAuth(req: AuthRequest, res: Response, next: NextFunction) {
  let id: string | undefined;

  if (req.header(sslHeader)) {
    const certificateContents = req.header(sslHeader);
    const commonName = certificateContents ? certificateContents.match(/CN=.+\.[0-9]{10}\b/ig) : null;
    if (commonName && commonName.length > 0) {
      id = commonName[0].substr(commonName[0].lastIndexOf('.') + 1, commonName[0].length);
    }
  } else if (req.header(internalAccessHeader)
    && process.env.INTERNAL_ACCESS_KEY === req.header(internalAccessHeader)) {
    id = 'internal';
  } else if (process.env.NODE_ENV === 'development') {
    id = process.env.USER_EDIPI;
  }

  if (!id) {
    throw new UnauthorizedError('Client not authorized.', true);
  }

  await getManager().transaction(async transactionalEntityManager => {
    let user: User | undefined;
    if (id === 'internal') {
      user = User.internal();
    } else {
      user = await transactionalEntityManager.findOne<User>('User', {
        relations: ['userRoles', 'userRoles.role', 'userRoles.role.org', 'userRoles.role.workspace', 'userRoles.role.org.contact'],
        where: {
          edipi: id,
        },
      });
    }

    if (!user) {
      user = transactionalEntityManager.create<User>('User', {
        edipi: id,
      });
    }

    if (user?.rootAdmin) {
      const roles = (await transactionalEntityManager.find<Org>('Org'))
        .map(org => Role.admin(org));
      await user!.addRoles(transactionalEntityManager, roles);
    }

    req.appUser = user;
  });

  next();
}

export async function requireInternalUser(req: ApiRequest, res: Response, next: NextFunction) {
  if (req.appUser.isInternal()) {
    return next();
  }
  throw new ForbiddenError('User does not have sufficient privileges to perform this action.');
}

export async function requireRegisteredUser(req: ApiRequest, res: Response, next: NextFunction) {
  if (req.appUser.isRegistered) {
    return next();
  }
  throw new ForbiddenError('User is not registered.');
}

export async function requireRootAdmin(req: ApiRequest, res: Response, next: NextFunction) {
  if (req.appUser.rootAdmin) {
    return next();
  }
  throw new ForbiddenError('User does not have sufficient privileges to perform this action.');
}

export async function requireOrgAccess(req: any, res: Response, next: NextFunction) {
  let orgId: number | undefined;
  if (req.params.orgId) {
    orgId = parseInt(req.params.orgId);
  } else if (req.query.orgId) {
    orgId = parseInt(req.query.orgId);
  } else if (req.cookies.orgId) {
    orgId = parseInt(req.cookies.orgId);
  }
  if (orgId == null) {
    throw new BadRequestError('Missing organization id.');
  }
  if (Number.isNaN(orgId) || orgId < 0) {
    throw new BadRequestError(`Invalid organization id: ${orgId}`);
  }
  const user: User = req.appUser;
  if (orgId && user) {
    const orgUserRole = user.userRoles.find(userRole => userRole.role.org!.id === orgId);
    if (orgUserRole) {
      req.appOrg = orgUserRole.role.org;
      req.appRole = orgUserRole.role;
      req.appWorkspace = orgUserRole.role.workspace;
    } else if (user.rootAdmin) {
      const org = await Org.findOne({
        where: {
          id: orgId,
        },
      });
      if (org) {
        req.appOrg = org;
        req.appRole = Role.admin(org);
      } else {
        throw new NotFoundError('Organization was not found.');
      }
    }
  }
  if (req.appOrg) {
    return next();
  }
  throw new ForbiddenError('User does not have sufficient privileges to perform this action.');
}

export function requireWorkspaceAccess(req: any, res: Response, next: NextFunction) {
  if (req.appWorkspace) {
    return next();
  }
  throw new ForbiddenError('User does not have sufficient privileges to perform this action.');
}

export function requireRolePermission(action: (role: Role) => boolean) {
  return async (req: ApiRequest, res: Response, next: NextFunction) => {
    if (req.appRole && action(req.appRole)) {
      return next();
    }
    throw new ForbiddenError('User does not have sufficient privileges to perform this action.');
  };
}

type AuthRequest = {
  appUser?: User
} & Request;
