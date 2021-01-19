import { Response } from 'express';
import { getConnection } from 'typeorm';
import { ApiRequest, OrgParam, OrgRoleParams } from '../index';
import { Roster } from '../roster/roster.model';
import { Role } from './role.model';
import { BadRequestError, NotFoundError } from '../../util/error-types';
import { Workspace } from '../workspace/workspace.model';
import { Notification } from '../notification/notification.model';

class RoleController {

  async getOrgRoles(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const roles = await Role.find({
      relations: ['workspace'],
      where: {
        org: req.appOrg.id,
      },
      order: {
        id: 'ASC',
      },
    });

    res.json(roles);
  }

  async addRole(req: ApiRequest<OrgParam, RoleBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    if (!req.body.name) {
      throw new BadRequestError('A name must be supplied when adding a role.');
    }

    if (!req.body.description) {
      throw new BadRequestError('A description must be supplied when adding a role.');
    }

    const role = new Role();
    role.org = req.appOrg;
    await setRoleFromBody(req.appOrg.id, role, req.body);

    const newRole = await role.save();

    res.status(201).json(newRole);
  }

  async getRole(req: ApiRequest<OrgRoleParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      relations: ['workspace'],
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    res.json(role);
  }

  async deleteRole(req: ApiRequest<OrgRoleParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    const userCount = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from('user_role', 'user_role')
      .where('user_role.role_id = :id', { id: roleId })
      .getCount();

    if (userCount > 0) {
      throw new BadRequestError('Cannot delete a role that is assigned to users.');
    }

    const removedRole = await role.remove();
    res.json(removedRole);
  }

  async updateRole(req: ApiRequest<OrgRoleParams, RoleBody>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }
    const roleId = parseInt(req.params.roleId);

    const role = await Role.findOne({
      where: {
        id: roleId,
        org: req.appOrg.id,
      },
    });

    if (!role) {
      throw new NotFoundError('Role could not be found.');
    }

    await setRoleFromBody(req.appOrg.id, role, req.body);

    const updatedRole = await role.save();

    res.json(updatedRole);
  }

}

async function setRoleFromBody(orgId: number, role: Role, body: RoleBody) {
  if (body.name != null) {
    role.name = body.name;
  }
  if (body.description != null) {
    role.description = body.description;
  }

  if (body.workspaceId !== undefined) {
    if (body.workspaceId == null) {
      role.workspace = null;
    } else {
      const workspace = await Workspace.findOne({
        where: {
          id: body.workspaceId,
          org: orgId,
        },
      });

      if (!workspace) {
        throw new NotFoundError('Workspace could not be found.');
      }

      role.workspace = workspace;
    }
  }
  if (body.defaultIndexPrefix != null) {
    role.defaultIndexPrefix = body.defaultIndexPrefix;
  }
  if (body.canManageGroup != null) {
    role.canManageGroup = body.canManageGroup;
  }
  if (body.canManageRoster != null) {
    role.canManageRoster = body.canManageRoster;
  }
  if (body.canManageWorkspace != null) {
    role.canManageWorkspace = body.canManageWorkspace;
  }
  if (body.canViewRoster != null) {
    role.canViewRoster = body.canViewRoster;
  }
  if (body.canViewMuster != null) {
    role.canViewMuster = body.canViewMuster;
  }
  if (body.canViewPII != null) {
    role.canViewPII = body.canViewPII;
  }
  if (body.canViewPHI != null) {
    role.canViewPHI = body.canViewPHI;
  }
  if (body.allowedRosterColumns != null) {
    if (!(body.allowedRosterColumns.length === 1 && body.allowedRosterColumns[0] === '*')) {
      const orgRosterColumns = await Roster.getColumns(orgId);
      for (const column of body.allowedRosterColumns) {
        if (!orgRosterColumns.some(rosterColumn => rosterColumn.name === column)) {
          throw new BadRequestError(`Unknown roster column: ${column}`);
        }
      }
    }
    role.allowedRosterColumns = body.allowedRosterColumns;
  }
  if (body.allowedNotificationEvents != null) {
    if (!(body.allowedNotificationEvents.length === 1 && body.allowedNotificationEvents[0] === '*')) {
      const notifications = await Notification.find();
      for (const allowedNotification of body.allowedNotificationEvents) {
        if (!notifications.some(notification => notification.id === allowedNotification)) {
          throw new BadRequestError(`Unknown notification event: ${allowedNotification}`);
        }
      }
    }
    role.allowedNotificationEvents = body.allowedNotificationEvents;
  }
}

type RoleBody = {
  name?: string
  description?: string
  workspaceId?: number | null
  defaultIndexPrefix?: string | null
  allowedRosterColumns?: string[]
  allowedNotificationEvents?: string[]
  canManageGroup?: boolean
  canManageRoster?: boolean
  canManageWorkspace?: boolean
  canViewRoster?: boolean
  canViewMuster?: boolean
  canViewPII?: boolean
  canViewPHI?: boolean
};

export default new RoleController();
