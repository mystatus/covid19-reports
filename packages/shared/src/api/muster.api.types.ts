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
  unitId?: string;
} & PaginatedQuery;

export type GetMusterUnitTrendsQuery = {
  currentDate: string;
  weeksCount?: string;
  monthsCount?: string;
};

export type GetClosedMusterWindowsQuery = {
  since: string;
  until: string;
};

export type GetNearestMusterWindowQuery = {
  timestamp: string;
  reportId: string;
};

export type GetMusterComplianceByDateRangeQuery = {
  isoStartDate: string;
  isoEndDate: string;
};

export type GetMusterComplianceByDateRangeResponse = {
  musterComplianceRates: MusterComplianceByDate[];
};

export type MusterComplianceByDate = {
  musterComplianceRate: number;
  isoDate: string;
};
