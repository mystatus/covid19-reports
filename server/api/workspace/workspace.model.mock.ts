import { uniqueString } from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { WorkspaceTemplate } from './workspace-template.model';
import { Workspace } from './workspace.model';

export async function seedWorkspace(org: Org, workspaceTemplate: WorkspaceTemplate) {
  const workspace = Workspace.create({
    name: uniqueString(),
    description: uniqueString(),
    org,
    workspaceTemplate,
    pii: true,
    phi: true,
  });
  return workspace.save();
}
