import { json2csvAsync } from 'json-2-csv';
import _ from 'lodash';
import {
  Entity,
  EntityTarget,
  Unique,
} from 'typeorm';
import { Unit } from '../unit/unit.model';
import {
  baseRosterColumns,
  RosterColumnInfo,
  RosterColumnValue,
  RosterEntrySerialized,
  RosterFileRow,
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

  static async getAllowedColumns(org: Org, role: Role) {
    const allColumns = await Roster.getColumns(org.id);
    return super._getAllowedColumns(org, role, allColumns);
  }

  static async getColumns(orgId: number) {
    return super._getColumns(orgId, baseRosterColumns);
  }

  static async getCsvTemplate(org: Org) {
    const columns = await Roster.getColumns(org.id);
    return super._getCsvTemplate(columns);
  }

  static async buildQuery(org: Org, userRole: UserRole, columns?: RosterColumnInfo[]) {
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

  static async getCsv(org: Org, userRole: UserRole) {
    const queryBuilder = await Roster.buildQuery(org, userRole);
    const rosterData = await queryBuilder
      .orderBy({
        edipi: 'ASC',
      })
      .getRawMany<RosterEntrySerialized>();

    const unitIdNameMap: { [key: number]: string } = {};
    const units = await Unit.find({
      where: {
        org: org.id,
      },
    });

    units.forEach(unit => {
      unitIdNameMap[unit.id] = unit.name;
    });

    const columns = await Roster.getAllowedColumns(org, userRole.role);
    const columnsLookup: { [columnName: string]: RosterColumnInfo } = {};
    for (const column of columns) {
      columnsLookup[column.name] = column;
    }

    // Convert json data to csv and return the csv.
    return json2csvAsync(rosterData.map(entry => {
      // Return data using display names for headers.
      const row: RosterFileRow<RosterColumnValue> = {
        Unit: unitIdNameMap[entry.unit],
      };

      for (const columnName of Object.keys(entry)) {
        const column = columnsLookup[columnName];
        if (column == null || column.name === 'unit') {
          continue;
        }

        row[column.displayName] = entry[columnName];
      }

      return row;
    }));
  }

}
