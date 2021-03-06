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
import { WorkspaceTemplate } from './api/workspace/workspace-template.model';
import { ReportSchema } from './api/report-schema/report-schema.model';
import { CustomRosterColumn } from './api/roster/custom-roster-column.model';
import { Workspace } from './api/workspace/workspace.model';
import { Notification } from './api/notification/notification.model';
import { Observation } from './api/observation/observation.model';

export const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.SQL_HOST || 'localhost',
  port: parseInt(process.env.SQL_PORT || '5432'),
  username: process.env.SQL_USER || 'postgres',
  password: process.env.SQL_PASSWORD || 'postgres',
  database: process.env.SQL_DATABASE || 'dds',
  entities: [
    UserRole,
    User,
    Role,
    Org,
    RosterHistory,
    Roster,
    AccessRequest,
    Unit,
    Workspace,
    ReportSchema,
    WorkspaceTemplate,
    CustomRosterColumn,
    Notification,
    UserNotificationSetting,
    OrphanedRecord,
    OrphanedRecordAction,
    Observation,
  ],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: (env.isDev && process.env.SYNC_DATABASE === 'true'),
  logging: (!env.isProd && process.env.ORM_LOGGING === 'true'),
  migrations: ['src/migration/*.ts'],
  cli: {
    migrationsDir: 'src/migration',
  },
  cache: (process.env.TYPEORM_CACHE)
    ? (process.env.TYPEORM_CACHE === 'true')
    : true,
};
