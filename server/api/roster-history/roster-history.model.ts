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
  RosterHistoryChangeType,
} from '../roster/roster.types';

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

  static async getAllowedColumns(org: Org, role: Role) {
    const columns = await RosterHistory.getColumns(org.id);
    return RosterHistory._getAllowedColumns(org, role, columns);
  }

  static async getColumns(orgId: number) {
    return RosterHistory._getColumns(orgId, baseRosterHistoryColumns);
  }

  static async getCsvTemplate(org: Org) {
    const columns = await RosterHistory.getColumns(org.id);
    return RosterHistory._getCsvTemplate(columns);
  }

}
