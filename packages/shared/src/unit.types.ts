import { OrgSerialized } from './org.types';

export interface MusterConfiguration extends MusterConfBase{
  days?: number,
}

export interface MusterConfWithDateArray extends MusterConfBase{
  days: number[],
}

export interface MusterConfBase {
  startTime: string,
  timezone: string,
  durationMinutes: number,
  reportId: string,
}

export type UnitSerialized = {
  id: number
  org?: OrgSerialized
  name: string
  includeDefaultConfig: boolean
  musterConfiguration: MusterConfiguration[]
};
