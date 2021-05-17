import _ from 'lodash';
import {
  Entity,
  EntityTarget,
  Unique,
} from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import {
  baseRosterColumns,
  RosterColumnInfo,
  RosterColumnType,
} from './roster.types';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { RosterEntity } from './roster-entity';
import { UserRole } from '../user/user-role.model';

@Entity()
@Unique(['edipi', 'unit'])
export class Roster extends RosterEntity {

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

  static getColumnSelect(column: RosterColumnInfo) {
    // Make sure custom columns are converted to appropriate types
    if (column.custom) {
      switch (column.type) {
        case RosterColumnType.Boolean:
          return `(roster.custom_columns ->> '${column.name}')::BOOLEAN`;
        case RosterColumnType.Number:
          return `(roster.custom_columns ->> '${column.name}')::DOUBLE PRECISION`;
        default:
          return `roster.custom_columns ->> '${column.name}'`;
      }
    }
    return `roster.${snakeCase(column.name)}`;
  }

  static async queryAllowedRoster(org: Org, userRole: UserRole, columns?: RosterColumnInfo[]) {
    //
    // Query the roster, returning only columns and rows that are allowed for the role of the requester.
    //
    if (!columns) {
      columns = await Roster.getAllowedColumns(org, userRole.role);
    }
    const queryBuilder = Roster.createQueryBuilder('roster').select([]);
    queryBuilder.leftJoin('roster.unit', 'u');
    // Always select the id column
    queryBuilder.addSelect('roster.id', 'id');
    queryBuilder.addSelect('u.id', 'unit');

    // Add all columns that are allowed by the user's role
    columns.forEach(column => {
      queryBuilder.addSelect(Roster.getColumnSelect(column), column.name);
    });

    // Filter out roster entries that are not on the active roster or are not allowed by the role's index prefix.
    queryBuilder
      .where('u.org_id = :orgId', { orgId: org.id });

    if (!userRole.allUnits) {
      queryBuilder
        .andWhere(`u.id IN (${(await userRole.getUnits()).map(unit => unit.id).join(',')})`);
    }

    return queryBuilder;
  }

  static async getAllowedColumns(org: Org, role: Role) {
    const allColumns = await Roster.getColumns(org.id);
    return Roster._getAllowedColumns(org, role, allColumns);
  }

  static async getColumns(orgId: number) {
    return Roster._getColumns(orgId, baseRosterColumns);
  }

  static async getCsvTemplate(org: Org) {
    const columns = await Roster.getColumns(org.id);
    return Roster._getCsvTemplate(columns);
  }

}
