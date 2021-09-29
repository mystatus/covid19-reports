import { PaginatedQuery } from './api.types';

export type MusterConfigurationData = {
  days: number | null;
  reportId: string;
  startTime: string;
  timezone: string;
  durationMinutes: number;
  filters: {
    id: number;
    params: {
      [key: string]: string;
    };
  }[];
};

export type AddMusterConfigurationBody = MusterConfigurationData;

export type UpdateMusterConfigurationBody = MusterConfigurationData;

export type GetMusterRosterQuery = {
  fromDate: string;
  toDate: string;
  reportId: string;
  filterId?: string;
} & PaginatedQuery;

export type GetWeeklyMusterTrendsQuery = {
  weeksCount?: string;
};

export type CloseMusterWindowsQuery = {
  since: string;
  until: string;
};

export type GetNearestMusterWindowQuery = {
  timestamp: string;
  reportId: string;
};

export type GetMusterComplianceByDateRangeQuery = {
  fromDate: string;
  toDate: string;
  filterId: string;
  reportId: string;
};

export type GetMusterComplianceByDateRangeResponse = {
  musterComplianceRates: MusterComplianceByDate[];
};

export type MusterComplianceByDate = {
  unit: number;
  onTime: number;
  total: number;
  compliance: number;
  isoDate: string;
};
