import { Response } from 'express';
import { getConnection } from 'typeorm';
import { KibanaApi } from '../../kibana/kibana-api';
import {
  getKibanaWorkspaceDashboards,
  setupKibanaWorkspace,
} from '../../kibana/kibana-utility';
import { assertRequestBody } from '../../util/api-utils';
import {
  ApiRequest,
  OrgParam,
  OrgWorkspaceParams,
  WorkspaceParam,
} from '../api.router';
import { Workspace } from './workspace.model';
import {
  BadRequestError,
  NotFoundError,
} from '../../util/error-types';
import { WorkspaceTemplate } from './workspace-template.model';

class WorkspaceController {

  async getOrgWorkspaces(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appUserRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const workspaces = await Workspace.find({
      relations: ['workspaceTemplate'],
      where: {
        org: req.appOrg.id,
      },
      order: {
        id: 'ASC',
      },
    });

    res.json(workspaces);
  }

  async getOrgWorkspaceTemplates(req: ApiRequest, res: Response) {
    if (!req.appOrg || !req.appUserRole) {
      throw new NotFoundError('Organization was not found.');
    }

    const templates = await WorkspaceTemplate.find({
      select: ['id', 'name', 'description', 'pii', 'phi'],
      order: {
        id: 'ASC',
      },
    });

    res.json(templates);
  }

  async addWorkspace(req: ApiRequest<OrgParam, AddWorkspaceBody>, res: Response) {
    const { name, description, templateId } = assertRequestBody(req, [
      'name',
      'description',
      'templateId',
    ]);

    const template = await WorkspaceTemplate.findOne({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      throw new NotFoundError('Workspace template could not be found.');
    }

    const workspace = new Workspace();
    workspace.org = req.appOrg;
    workspace.workspaceTemplate = template;
    workspace.pii = template.pii;
    workspace.phi = template.phi;
    workspace.name = name;
    workspace.description = description;

    await getConnection().transaction(async manager => {
      await manager.save(workspace);

      // Create new Kibana workspace.
      // NOTE: We can't connect to the Kibana API with middleware when creating a workspace, since the workspace
      // doesn't exist yet to build the JWT with. So connect manually now that it exists.
      req.appWorkspace = workspace;
      await KibanaApi.connect(req);
      await setupKibanaWorkspace(workspace, req.kibanaApi!);
    });

    await res.status(201).json(workspace);
  }

  async getWorkspace(req: ApiRequest<OrgWorkspaceParams>, res: Response) {
    const workspaceId = parseInt(req.params.workspaceId);

    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId,
        org: req.appOrg!.id,
      },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace could not be found.');
    }

    res.json(workspace);
  }

  async deleteWorkspace(req: ApiRequest<OrgWorkspaceParams>, res: Response) {
    const workspaceId = parseInt(req.params.workspaceId);

    const workspace = await Workspace.findOne({
      relations: ['roles'],
      where: {
        id: workspaceId,
        org: req.appOrg!.id,
      },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace could not be found.');
    }

    if (workspace.roles!.length > 0) {
      throw new BadRequestError('Cannot delete a workspace that is assigned to a role.');
    }

    const removedWorkspace = await workspace.remove();
    res.json(removedWorkspace);
  }

  async updateWorkspace(req: ApiRequest<WorkspaceParam, UpdateWorkspaceBody>, res: Response) {
    const workspaceId = parseInt(req.params.workspaceId);
    const { name, description } = req.body;

    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId,
        org: req.appOrg!.id,
      },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace could not be found.');
    }

    if (name) {
      workspace.name = name;
    }
    if (description) {
      workspace.description = description;
    }

    const updatedWorkspace = await workspace.save();

    res.json(updatedWorkspace);
  }

  async getWorkspaceDashboards(req: ApiRequest<WorkspaceParam>, res: Response) {
    const dashboards = await getKibanaWorkspaceDashboards(req.kibanaApi!);
    res.json(dashboards);
  }

}

export type AddWorkspaceBody = {
  name: string
  description: string
  templateId: number
};

export type UpdateWorkspaceBody = {
  name?: string
  description?: string
};

export default new WorkspaceController();
