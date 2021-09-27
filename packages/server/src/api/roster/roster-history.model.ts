import {
  Column,
  CreateDateColumn,
  Entity,
  EntityTarget,
  Index,
} from 'typeorm';
import {
  baseRosterColumns,
  ColumnInfo,
} from '@covid19-reports/shared';
import { RosterEntity } from './roster-entity';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { UserRole } from '../user/user-role.model';
import { getColumnSelect, getColumnWhere, isColumnAllowed, MakeEntity } from '../../util/entity-utils';
import { timestampColumnTransformer } from '../../util/util';


export enum ChangeType {
  Added = 'added',
  Changed = 'changed',
  Deleted = 'deleted',
}


@MakeEntity()
@Entity()
export class RosterHistory extends RosterEntity {

  @Index('roster-history-timestamp')
  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  timestamp!: Date;

  @Index('roster-history-change-type')
  @Column({
    type: 'enum',
    enum: ChangeType,
    default: ChangeType.Changed,
  })
  changeType!: ChangeType;

  getEntityTarget(): EntityTarget<any> {
    return RosterHistory;
  }

  static getColumnSelect(column: ColumnInfo) {
    return getColumnSelect(column, 'custom_columns', 'roster');
  }

  static getColumnWhere(column: ColumnInfo) {
    return getColumnWhere(column, 'custom_columns', 'roster', true);
  }

  static async buildSearchQuery(org: Org, userRole: UserRole, columns: ColumnInfo[]) {
    //
    // Query the roster, returning only columns and rows that are allowed for the role of the requester.
    //
    const queryBuilder = RosterHistory.createQueryBuilder('roster').select([]);
    queryBuilder.leftJoin('roster.unit', 'u');
    // Always select the id column
    queryBuilder.addSelect('roster.id', 'id');
    queryBuilder.addSelect('u.id', 'unit');

    // Add all columns that are allowed by the user's role
    columns.forEach(column => {
      queryBuilder.addSelect(RosterHistory.getColumnSelect(column), column.name);
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

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  static async getColumns(org: Org, includeRelationships?: boolean, version?: string) {
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

  static filterAllowedColumns(columns: ColumnInfo[], role: Role) {
    const fineGrained = !(role.allowedRosterColumns.length === 1 && role.allowedRosterColumns[0] === '*');
    return columns.filter(column => {
      if (fineGrained && role.allowedRosterColumns.indexOf(column.name) < 0) {
        return false;
      }
      return isColumnAllowed(column, role);
    });
  }

}
