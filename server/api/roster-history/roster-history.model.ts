import { json2csvAsync } from 'json-2-csv';
import {
  Column,
  CreateDateColumn,
  Entity,
  EntityTarget,
} from 'typeorm';
import { timestampColumnTransformer } from '../../util/util';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import { RosterEntity } from '../roster/roster-entity';
import {
  baseRosterHistoryColumns,
  RosterColumnInfo,
  RosterColumnValue,
  RosterHistoryChangeType,
  RosterHistoryEntrySerialized,
  RosterHistoryFileRow,
} from '../roster/roster.types';
import { Unit } from '../unit/unit.model';

@Entity()
export class RosterHistory extends RosterEntity {

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  timestamp!: Date;

  @Column({
    type: 'enum',
    enum: RosterHistoryChangeType,
    default: RosterHistoryChangeType.Changed,
  })
  changeType!: RosterHistoryChangeType;

  getEntityTarget(): EntityTarget<any> {
    return RosterHistory;
  }

  serialize(): RosterHistoryEntrySerialized {
    return {
      ...super.serialize(),
      timestamp: this.timestamp.toISOString(),
      changeType: this.changeType,
    } as RosterHistoryEntrySerialized;
  }

  static async getAllowedColumns(org: Org, role: Role) {
    const columns = await RosterHistory.getColumns(org.id);
    return super._getAllowedColumns(org, role, columns);
  }

  static async getColumns(orgId: number) {
    return super._getColumns(orgId, baseRosterHistoryColumns);
  }

  static async getCsvTemplate(org: Org) {
    const columns = await RosterHistory.getColumns(org.id);
    return super._getCsvTemplate(columns);
  }

  static async buildQuery(org: Org) {
    const columns = await RosterHistory.getColumns(org.id);
    const queryBuilder = RosterHistory.createQueryBuilder('roster').select([]);
    queryBuilder.leftJoin('roster.unit', 'u');
    queryBuilder.addSelect('roster.id', 'id');
    queryBuilder.addSelect('u.id', 'unit');

    columns.forEach(column => {
      queryBuilder.addSelect(RosterHistory.getColumnSelect(column), column.name);
    });

    return queryBuilder;
  }

  static async getCsv(org: Org) {
    const queryBuilder = await RosterHistory.buildQuery(org);
    const rosterData = await queryBuilder
      .orderBy({
        timestamp: 'ASC',
      })
      .getRawMany<RosterHistoryEntrySerialized>();

    const unitIdNameMap: { [key: number]: string } = {};
    const units = await Unit.find({
      where: {
        org: org.id,
      },
    });

    units.forEach(unit => {
      unitIdNameMap[unit.id] = unit.name;
    });

    const columns = await RosterHistory.getColumns(org.id);
    const columnsLookup: { [columnName: string]: RosterColumnInfo } = {};
    for (const column of columns) {
      columnsLookup[column.name] = column;
    }

    // Convert json data to csv and return the csv.
    return json2csvAsync(rosterData.map(entry => {
      // Return data using display names for headers.
      const row: RosterHistoryFileRow<RosterColumnValue> = {
        Unit: unitIdNameMap[entry.unit],
        Timestamp: entry.timestamp,
        'Change Type': entry.changeType,
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
