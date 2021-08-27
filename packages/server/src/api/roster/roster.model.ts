import _ from 'lodash';
import {
  Entity,
  EntityTarget,
  SelectQueryBuilder,
  Unique,
} from 'typeorm';
import {
  baseRosterColumns,
  ColumnInfo,
} from '@covid19-reports/shared';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { RosterEntity } from './roster-entity';
import { UserRole } from '../user/user-role.model';
import { getColumnSelect, isColumnAllowed, MakeEntity } from '../../util/entity-utils';

@MakeEntity()
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

  static getColumnSelect(column: ColumnInfo) {
    return getColumnSelect(column, 'custom_columns', 'roster');
  }

  static async search(org: Org, userRole: UserRole, columns: ColumnInfo[]): Promise<SelectQueryBuilder<Roster>> {
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

  static filterAllowedColumns(columns: ColumnInfo[], role: Role) {
    const fineGrained = !(role.allowedRosterColumns.length === 1 && role.allowedRosterColumns[0] === '*');
    return columns.filter(column => {
      if (fineGrained && role.allowedRosterColumns.indexOf(column.name) < 0) {
        return false;
      }
      return isColumnAllowed(column, role);
    });
  }

  static async getColumns(org: Org) {
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
    return [...baseRosterColumns, ...customColumns];
  }

}
