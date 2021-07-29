import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { WorkspaceTemplate } from './workspace-template.model';
import { Workspace } from './workspace.model';

export function mockWorkspace(org: Org, workspaceTemplate: WorkspaceTemplate) {
  return Workspace.create({
    name: uniqueString(),
    description: uniqueString(),
    org,
    workspaceTemplate,
    pii: true,
    phi: true,
  });
}

export function seedWorkspace(org: Org, workspaceTemplate: WorkspaceTemplate) {
  return mockWorkspace(org, workspaceTemplate).save();
}

export function seedWorkspaces(org: Org, workspaceTemplate: WorkspaceTemplate, options: {
  count: number;
}) {
  const { count } = options;
  const workspaces = [] as Workspace[];

  for (let i = 0; i < count; i++) {
    workspaces.push(mockWorkspace(org, workspaceTemplate));
  }

  return Workspace.save(workspaces);
}
