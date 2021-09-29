import _ from 'lodash';
import {
  Entity,
  EntityTarget,
  Unique,
} from 'typeorm';
import {
  baseRosterColumns,
  ColumnInfo,
  ColumnType,
} from '@covid19-reports/shared';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { RosterEntity } from './roster-entity';
import { UserRole } from '../user/user-role.model';
import { getColumnSelect, getColumnWhere, isColumnAllowed, MakeEntity } from '../../util/entity-utils';
import { Observation } from '../observation/observation.model';


@MakeEntity()
@Entity()
@Unique(['edipi', 'unit'])
export class Roster extends RosterEntity {

  static sqlRawColumns: Array<ColumnInfo & { sql: string }> = [{
    name: 'reportCount',
    table: 'observation',
    displayName: 'Report Count',
    type: ColumnType.Number,
    pii: true,
    phi: false,
    custom: false,
    required: false,
    updatable: false,
    sql: 'COUNT("observation"."edipi")',
  }, {
    name: 'latestReportDate',
    table: 'observation',
    displayName: 'Latest Report Date',
    type: ColumnType.DateTime,
    pii: true,
    phi: false,
    custom: false,
    required: false,
    updatable: false,
    sql: 'MAX("observation"."timestamp")',
  }, {
    name: 'detailsSymptomsCount',
    table: 'observation',
    displayName: 'Reports with Symptoms',
    type: ColumnType.Number,
    pii: true,
    phi: false,
    custom: false,
    required: false,
    updatable: false,
    sql: `COUNT(json_array_length("observation"."custom_columns"->'Details'->'Symptoms') > 0)`,
  }, {
    name: 'lastReportWithSymptoms',
    table: 'observation',
    displayName: 'Last Reported Symptoms',
    type: ColumnType.DateTime,
    pii: true,
    phi: true,
    custom: false,
    required: false,
    updatable: false,
    sql: `MAX(case when json_array_length("observation"."custom_columns"->'Details'->'Symptoms') > 0 then "observation"."timestamp" end)`,
  }];

  getEntityTarget(): EntityTarget<any> {
    return Roster;
  }

  clone() {
    const entry = new Roster();
    entry.edipi = this.edipi;
    entry.unit = this.unit;
    entry.firstName = this.firstName;
    entry.lastName = this.lastName;
    entry.customColumns = _.cloneDeep(this.customColumns);
    return entry;
  }

  static getColumnSelect(column: ColumnInfo) {
    const raw = Roster.sqlRawColumns.find(c => c.name === column.name);
    if (raw) {
      return raw.sql;
    }
    return getColumnSelect(column, 'custom_columns', 'roster');
  }

  static getColumnWhere(column: ColumnInfo) {
    return getColumnWhere(column, 'custom_columns', 'roster', true);
  }

  static async buildSearchQuery(org: Org, userRole: UserRole, columns: ColumnInfo[]) {
    //
    // Query the roster, returning only columns and rows that are allowed for the role of the requester.
    //
    const queryBuilder = Roster.createQueryBuilder('roster').select([]);
    queryBuilder.leftJoin('roster.unit', 'u');
    // Always select the id column
    queryBuilder.addSelect('roster.id', 'id');
    queryBuilder.addSelect('u.id', 'unit');

    // Add all columns that are allowed by the user's role
    columns.forEach(column => {
      if (!column.table || column.table === 'roster') {
        queryBuilder.addSelect(Roster.getColumnSelect(column), column.name);
      } else {
        queryBuilder.addSelect(`"${column.table}"."${column.name}"`, column.name);
      }
    });

    // Filter out roster entries that are not on the active roster or are not allowed by the role's index prefix.
    queryBuilder
      .where('u.org_id = :orgId', { orgId: org.id });

    queryBuilder.leftJoin(
      qb => {
        qb.select(['edipi'])
          .from(Observation, 'observation')
          .groupBy('observation.edipi');

        columns.forEach(column => {
          if (column.table && column.table !== 'roster') {
            // Ugh, hijacking Roster to keep the aggregate logic local - this isn't final
            qb.addSelect(Roster.getColumnSelect(column), column.name);
          }
        });

        return qb;
      },
      'observation',
      `"roster"."edipi" = "observation"."edipi"`,
    );

    if (!userRole.allUnits) {
      queryBuilder
        .andWhere(`u.id IN (${(await userRole.getUnits()).map(unit => unit.id).join(',')})`);
    }

    return queryBuilder;
  }

  static filterAllowedColumns(columns: ColumnInfo[], role: Role) {
    const fineGrained = !(role.allowedRosterColumns.length === 1 && role.allowedRosterColumns[0] === '*');
    return columns.filter(column => {
      if (fineGrained && role.allowedRosterColumns.indexOf(column.name) < 0) {
        return false;
      }
      return isColumnAllowed(column, role);
    });
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  static async getColumns(org: Org, includeRelationships?: boolean, version?: string): Promise<ColumnInfo[]> {
    const customColumns: ColumnInfo[] = (await CustomRosterColumn.find({
      where: {
        org: org.id,
      },
    })).map(customColumn => ({
      ...customColumn,
      displayName: customColumn.display,
      custom: true,
      updatable: true,
    }));

    if (includeRelationships) {
      return [...baseRosterColumns, ...customColumns, ...Roster.sqlRawColumns];
    }

    return [...baseRosterColumns, ...customColumns];
  }

}
