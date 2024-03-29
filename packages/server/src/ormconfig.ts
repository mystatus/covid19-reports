import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { env } from './util/env';
import { User } from './api/user/user.model';
import { AccessRequest } from './api/access-request/access-request.model';
import { Org } from './api/org/org.model';
import { RosterHistory } from './api/roster/roster-history.model';
import { UserNotificationSetting } from './api/notification/user-notification-setting.model';
import { Unit } from './api/unit/unit.model';
import { OrphanedRecord } from './api/orphaned-record/orphaned-record.model';
import { Role } from './api/role/role.model';
import { OrphanedRecordAction } from './api/orphaned-record/orphaned-record-action.model';
import { Roster } from './api/roster/roster.model';
import { UserRole } from './api/user/user-role.model';
import { ReportSchema } from './api/report-schema/report-schema.model';
import { CustomRosterColumn } from './api/roster/custom-roster-column.model';
import { Notification } from './api/notification/notification.model';
import { Observation } from './api/observation/observation.model';
import { SavedFilter } from './api/saved-filter/saved-filter.model';
import { SavedLayout } from './api/saved-layout/saved-layout.model';
import { MusterConfiguration } from './api/muster/muster-config.model';
import { MusterFilter } from './api/muster/muster-filter.model';

export const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.SQL_HOST || 'localhost',
  port: parseInt(process.env.SQL_PORT || '5432'),
  username: process.env.SQL_USER || 'postgres',
  password: process.env.SQL_PASSWORD || 'postgres',
  database: process.env.SQL_DATABASE || 'dds',
  entities: [
    AccessRequest,
    CustomRosterColumn,
    Notification,
    MusterConfiguration,
    MusterFilter,
    Observation,
    Org,
    OrphanedRecord,
    OrphanedRecordAction,
    ReportSchema,
    Role,
    Roster,
    RosterHistory,
    SavedFilter,
    SavedLayout,
    Unit,
    User,
    UserNotificationSetting,
    UserRole,
  ],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: (env.isDev && process.env.SYNC_DATABASE === 'true'),
  logging: !env.isProd && process.env.ORM_LOGGING === 'true',
  migrations: ['migration/*.ts'],
  cache: (process.env.TYPEORM_CACHE)
    ? (process.env.TYPEORM_CACHE === 'true')
    : true,
};
