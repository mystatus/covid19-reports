export type AddWorkspaceBody = {
  name: string;
  description: string;
  templateId: number;
};

export type UpdateWorkspaceBody = {
  name?: string;
  description?: string;
};
