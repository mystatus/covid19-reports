import { DaysOfTheWeek } from '../utility/days';

export type RosterColumnValue = string | boolean | number | null;

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

export enum ApiRosterColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Boolean = 'boolean',
  Enum = 'enum',
}

export function rosterColumnTypeDisplayName(type: ApiRosterColumnType) {
  switch (type) {
    case ApiRosterColumnType.Boolean:
      return 'Yes/No';
    case ApiRosterColumnType.Number:
      return 'Number';
    case ApiRosterColumnType.String:
      return 'Text';
    case ApiRosterColumnType.Enum:
      return 'Option';
    case ApiRosterColumnType.Date:
      return 'Date';
    case ApiRosterColumnType.DateTime:
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
  type: ApiRosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
  config: ApiRosterCustomColumnConfig,
}

export type ApiCustomColumns = {
  [columnName: string]: RosterColumnValue | undefined
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

export interface ApiMusterRosterEntry extends ApiRosterEntry {
  totalMusters: number
  mustersReported: number
  musterPercent: number
}

export interface ApiMusterRosterEntriesPaginated extends ApiPaginated<ApiMusterRosterEntry> {}

export interface ApiMusterTrends {
  weekly: ApiUnitStatsByDate
  monthly: ApiUnitStatsByDate
}

export interface MusterConfiguration {
  days?: DaysOfTheWeek,
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
