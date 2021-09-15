export type OrgBody = {
  name?: string;
  description?: string;
  reportingGroup?: string;
};

export type AddOrgBody = OrgBody & {
  contactEdipi: string;
};
