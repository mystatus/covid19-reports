import {
  OrphanedRecordActionType,
  RosterColumnType,
  RosterColumnValue,
} from '@covid19-reports/shared';

export interface ApiPaginated<TData> {
  rows: TData[],
  totalRowsCount: number,
}

export interface ApiOrg {
  id: number,
  name: string,
  description: string,
  indexPrefix: string,
  contact?: ApiUser,
  defaultMusterConfiguration: MusterConfiguration[],
}

export interface ApiRole {
  id: number,
  org?: ApiOrg,
  workspaces: ApiWorkspace[],
  name: string,
  description: string,
  allowedRosterColumns: string[],
  allowedNotificationEvents: string[],
  canManageGroup: boolean,
  canManageRoster: boolean,
  canManageWorkspace: boolean,
  canViewRoster: boolean,
  canViewMuster: boolean,
  canViewPII: boolean,
  canViewPHI: boolean,
}

export interface ApiUserRole {
  id: number,
  role: ApiRole,
  user: ApiUser,
  units: ApiUnit[],
  allUnits: boolean,
  favoriteDashboards: {
    [workspaceId: string]: {
      [dashboardUuid: string]: boolean
    }
  },
}

export interface ApiUser {
  edipi: string,
  firstName: string,
  lastName: string,
  service: string,
  phone: string,
  email: string,
  userRoles?: ApiUserRole[],
  rootAdmin: boolean,
  isRegistered: boolean,
}

export interface ApiAccessRequest {
  id: number,
  org: ApiOrg,
  requestDate: Date,
  user: ApiUser,
  whatYouDo: string[]
  sponsorName: string
  sponsorEmail: string
  sponsorPhone: string
  justification: string
  status: 'approved' | 'pending' | 'denied',
}

export interface ApiRosterPaginated extends ApiPaginated<ApiRosterEntry> {}

export function rosterColumnTypeDisplayName(type: RosterColumnType) {
  switch (type) {
    case RosterColumnType.Boolean:
      return 'Yes/No';
    case RosterColumnType.Number:
      return 'Number';
    case RosterColumnType.String:
      return 'Text';
    case RosterColumnType.Enum:
      return 'Option';
    case RosterColumnType.Date:
      return 'Date';
    case RosterColumnType.DateTime:
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

export interface ColumnInfo {
  name: string
  displayName: string
}

export interface ApiRosterCustomColumnConfig {}

export interface ApiRosterStringColumnConfig extends ApiRosterCustomColumnConfig {
  multiline?: boolean
}

export type ApiRosterEnumColumnConfigOption = { id: string, label: string };

export interface ApiRosterEnumColumnConfig extends ApiRosterCustomColumnConfig {
  options?: ApiRosterEnumColumnConfigOption[]
}

export interface ApiRosterColumnInfo extends ColumnInfo {
  type: RosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
  config: ApiRosterCustomColumnConfig,
}

export type ApiCustomColumns = {
  [columnName: string]: RosterColumnValue
};

export type ApiRosterEntryData = {
  edipi: string,
  unit: number,
  firstName?: string,
  lastName?: string,
} & ApiCustomColumns;

export type ApiRosterEntry = ApiRosterEntryData & {
  id: number,
};

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
  count: number
}

export interface ApiOrphanedRecordAction {
  id: string;
  createdOn: string;
  expiresOn?: string;
  type: OrphanedRecordActionType;
}

export interface ApiWorkspaceTemplate {
  id: number,
  name: string,
  description: string,
  pii: boolean,
  phi: boolean,
}

export interface ApiWorkspace {
  id: number,
  name: string,
  description: string,
  org?: ApiOrg,
  workspaceTemplate?: ApiWorkspaceTemplate,
  pii: boolean,
  phi: boolean,
}

export interface ApiDashboard {
  uuid: string
  title: string
  description: string
}

export interface ApiUnitStatsByDate {
  [date: string]: {
    [unitName: string]: {
      totalMusters: number
      mustersReported: number
      musterPercent: number
    }
  }
}

export type ApiMusterRosterEntry = ApiRosterEntry & {
  totalMusters: number
  mustersReported: number
  musterPercent: number
};

export interface ApiMusterRosterEntriesPaginated extends ApiPaginated<ApiMusterRosterEntry> {}

export interface ApiMusterTrends {
  weekly: ApiUnitStatsByDate
  monthly: ApiUnitStatsByDate
}

export interface MusterConfiguration {
  days?: number[],
  startTime: string,
  timezone: string,
  durationMinutes: number,
  reportId: string,
}

export interface ApiReportSchema {
  id: string,
  name: string,
}

export interface ApiUnit {
  id: number,
  name: string,
  org?: ApiOrg,
  musterConfiguration: MusterConfiguration[],
  includeDefaultConfig: boolean,
}

export interface ApiError {
  message: string
  type: string
}

export interface ApiErrorResponseData {
  errors: ApiError[]
}

export interface ApiErrorResponse {
  data: ApiErrorResponseData
}

export interface ApiRosterUploadInfo {
  count: number
}
