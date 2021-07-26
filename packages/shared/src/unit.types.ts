import { OrgSerialized } from './org.types';

export type MusterConfiguration = {
  days?: number[]
  startTime: string
  timezone: string
  durationMinutes: number
  reportId: string
};

export type UnitSerialized = {
  id: number
  org?: OrgSerialized
  name: string
  includeDefaultConfig: boolean
  musterConfiguration: MusterConfiguration[]
};
