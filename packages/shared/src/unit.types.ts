import { OrgSerialized } from './org.types';

export type UnitSerialized = {
  id: number;
  org?: OrgSerialized;
  name: string;
};
