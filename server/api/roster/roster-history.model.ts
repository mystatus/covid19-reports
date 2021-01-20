import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RosterEntity } from './roster-entity';

export enum ChangeType {
  Added = 'added',
  Changed = 'changed',
  Deleted = 'deleted',
}

@Entity()
export class RosterHistory extends RosterEntity {

  @Column()
  timestamp!: Date;

  @Column({
    type: 'enum',
    enum: ChangeType,
    default: ChangeType.Changed,
  })
  changeType!: ChangeType;

}
