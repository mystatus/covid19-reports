import { MusterConfiguration } from '../unit.types';

export type UnitData = {
  name?: string;
  musterConfiguration?: MusterConfiguration[];
  includeDefaultConfig?: boolean;
};

export type AddUnitBody = UnitData;

export type UpdateUnitBody = UnitData;

export type GetUnitRosterQuery = {
  timestamp: string;
};
