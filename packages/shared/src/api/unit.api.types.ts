export type UnitData = {
  name?: string;
};

export type AddUnitBody = UnitData;

export type UpdateUnitBody = UnitData;

export type GetUnitRosterQuery = {
  timestamp: string;
};
