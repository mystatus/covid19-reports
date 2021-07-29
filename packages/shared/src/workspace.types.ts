import { OrgSerialized } from './org.types';
import { RoleSerialized } from './role.types';
import { WorkspaceTemplateSerialized } from './workspace-template.types';

export type WorkspaceSerialized = {
  id: number;
  name: string;
  description: string;
  org?: OrgSerialized;
  workspaceTemplate?: WorkspaceTemplateSerialized;
  pii: boolean;
  phi: boolean;
  roles?: RoleSerialized[];
};
