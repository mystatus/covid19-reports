import { MusterConfiguration } from '../unit.types';

export type OrgBody = {
  name?: string;
  description?: string;
  reportingGroup?: string;
};

export type AddOrgBody = OrgBody & {
  contactEdipi: string;
};

export type UpdateOrgDefaultMusterBody = {
  defaultMusterConfiguration: MusterConfiguration[];
};
