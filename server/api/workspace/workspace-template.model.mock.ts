import {
  uniqueInt,
  uniqueString,
} from '../../util/test-utils/unique';
import { WorkspaceTemplate } from './workspace-template.model';

export async function seedWorkspaceTemplate() {
  const workspaceTemplate = WorkspaceTemplate.create({
    id: uniqueInt(),
    name: uniqueString(),
    description: uniqueString(),
    pii: true,
    phi: true,
    kibanaSavedObjects: {
      stuff: uniqueString(),
    } as any,
  });
  return workspaceTemplate.save();
}
