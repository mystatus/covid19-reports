import {
  Column,
  CreateDateColumn,
  Entity,
  EntityTarget,
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

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  timestamp!: Date;

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
