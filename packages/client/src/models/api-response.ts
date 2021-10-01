import {
  ColumnType,
  CustomColumns,
  DaysOfTheWeek,
  OrphanedRecordActionType,
  SavedFilterSerialized,
} from '@covid19-reports/shared';

export interface ApiPaginated<TData> {
  rows: TData[];
  totalRowsCount: number;
}

export interface ApiOrg {
  id: number;
  name: string;
  description: string;
  indexPrefix: string;
  contact?: ApiUser;
}

export interface ApiRole {
  id: number;
  org?: ApiOrg;
  workspaces: ApiWorkspace[];
  name: string;
  description: string;
  allowedRosterColumns: string[];
  allowedNotificationEvents: string[];
  canManageGroup: boolean;
  canManageRoster: boolean;
  canManageWorkspace: boolean;
  canViewRoster: boolean;
  canViewMuster: boolean;
  canViewPII: boolean;
  canViewPHI: boolean;
}

export interface ApiUserRole {
  id: number;
  role: ApiRole;
  user: ApiUser;
  units: ApiUnit[];
  allUnits: boolean;
  favoriteDashboards: {
    [workspaceId: string]: {
      [dashboardUuid: string]: boolean;
    };
  };
}

export interface ApiUser {
  edipi: string;
  firstName: string;
  lastName: string;
  service: string;
  phone: string;
  email: string;
  userRoles?: ApiUserRole[];
  rootAdmin: boolean;
  isRegistered: boolean;
}

export interface ApiAccessRequest {
  id: number;
  org: ApiOrg;
  requestDate: Date;
  user: ApiUser;
  whatYouDo: string[];
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string;
  justification: string;
  status: 'approved' | 'pending' | 'denied';
}

export interface ApiRosterPaginated extends ApiPaginated<ApiRosterEntry> {}

export function rosterColumnTypeDisplayName(type: ColumnType) {
  switch (type) {
    case ColumnType.Boolean:
      return 'Yes/No';
    case ColumnType.Number:
      return 'Number';
    case ColumnType.String:
      return 'Text';
    case ColumnType.Enum:
      return 'Option';
    case ColumnType.Date:
      return 'Date';
    case ColumnType.DateTime:
      return 'Date and Time';
    default:
      return 'Unknown';
  }
}

export interface ApiNotification {
  id: string;
  name: string;
  description: string;
  settingsTemplate: string;
  defaultThreshold: number;
  defaultMaxDailyCount: number;
  defaultMinMinutesBetweenAlerts: number;
}

export interface ApiUserNotificationSetting {
  id: number;
  notificationId: string;
  threshold: number;
  minMinutesBetweenAlerts: number;
  maxDailyCount: number;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

export type ApiRosterEntryData = {
  edipi: string;
  unit: number;
  firstName?: string;
  lastName?: string;
} & CustomColumns;

export type ApiRosterEntry = ApiRosterEntryData & {
  id: number;
};

export type ApiObservationData = {
  edipi: string;
} & CustomColumns;

export type ApiObservation = ApiObservationData & {
  id: number;
};

export interface ApiObservationsPaginated extends ApiPaginated<ApiObservation> {}

export interface ApiOrphanedRecord {
  id: string;
  edipi: string;
  phone: string;
  unit: string;
  count: number;
  action?: string;
  claimedUntil?: Date;
  latestReportDate: Date;
  earliestReportDate: Date;
  unitId?: number;
  rosterHistoryId?: number;
}

export interface ApiOrphanedRecordsPaginated extends ApiPaginated<ApiOrphanedRecord> {}

export interface ApiOrphanedRecordsCount {
  count: number;
}

export interface ApiOrphanedRecordAction {
  id: string;
  createdOn: string;
  expiresOn?: string;
  type: OrphanedRecordActionType;
}

export interface ApiWorkspaceTemplate {
  id: number;
  name: string;
  description: string;
  pii: boolean;
  phi: boolean;
}

export interface ApiWorkspace {
  id: number;
  name: string;
  description: string;
  org?: ApiOrg;
  workspaceTemplate?: ApiWorkspaceTemplate;
  pii: boolean;
  phi: boolean;
}

export interface ApiDashboard {
  uuid: string;
  title: string;
  description: string;
}

export interface ApiUnitStatsByDate {
  [date: string]: {
    [unitName: string]: {
      totalMusters: number;
      mustersReported: number;
      musterPercent: number;
    };
  };
}

export interface ApiWeeklyMusterStats {
  onTime: number;
  total: number;
}

export type ApiMusterRosterEntry = ApiRosterEntry & {
  totalMusters: number;
  mustersReported: number;
  musterPercent: number;
};

export interface ApiMusterRosterEntriesPaginated extends ApiPaginated<ApiMusterRosterEntry> {}

export interface ApiMusterTrends {
  weekly: ApiWeeklyMusterStats[];
}

export interface ApiMusterConfiguration {
  id: number;
  days: DaysOfTheWeek | null;
  reportSchema: ApiReportSchema;
  filters: MusterFilter[];
  startTime: string;
  timezone: string;
  durationMinutes: number;
}

export interface MusterFilter {
  filter: SavedFilterSerialized;
  filterParams: {
    [key: string]: string;
  };
}

export interface ApiReportSchema {
  id: string;
  name: string;
}

export interface ApiUnit {
  id: number;
  name: string;
  org?: ApiOrg;
}

export interface ApiError {
  message: string;
  type: string;
}

export interface ApiErrorResponseData {
  errors: ApiError[];
}

export interface ApiErrorResponse {
  data: ApiErrorResponseData;
}

export interface ApiRosterUploadInfo {
  count: number;
}
