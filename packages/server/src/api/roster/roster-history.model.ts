import {
  Column,
  CreateDateColumn,
  Entity,
  EntityTarget,
  Index,
} from 'typeorm';
import { RosterEntity } from './roster-entity';
import { timestampColumnTransformer } from '../../util/util';

export enum ChangeType {
  Added = 'added',
  Changed = 'changed',
  Deleted = 'deleted',
}

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

}
