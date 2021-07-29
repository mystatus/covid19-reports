import {
  uniqueInt,
  uniqueString,
} from '../../util/test-utils/unique';
import { WorkspaceTemplate } from './workspace-template.model';

export function mockWorkspaceTemplate() {
  return WorkspaceTemplate.create({
    id: uniqueInt(),
    name: uniqueString(),
    description: uniqueString(),
    pii: true,
    phi: true,
    kibanaSavedObjects: [{
      stuff: uniqueString(),
    }],
  });
}

export function seedWorkspaceTemplate() {
  return mockWorkspaceTemplate().save();
}

export function seedWorkspaceTemplates(options: {
  count: number;
}) {
  const { count } = options;
  const workspaceTemplates = [] as WorkspaceTemplate[];

  for (let i = 0; i < count; i++) {
    workspaceTemplates.push(mockWorkspaceTemplate());
  }

  return WorkspaceTemplate.save(workspaceTemplates);
}
