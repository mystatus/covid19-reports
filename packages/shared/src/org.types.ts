import { UserSerialized } from './user.types';

export type OrgSerialized = {
  id: number;
  name: string;
  description: string;
  indexPrefix: string;
  reportingGroup?: string;
  contact?: UserSerialized;
};
