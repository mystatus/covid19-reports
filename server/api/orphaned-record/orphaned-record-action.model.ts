import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { timestampColumnTransformer } from '../../util/util';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';

export enum ActionType {
  Claim = 'claim',
  Ignore = 'ignore',
}

@Entity()
export class OrphanedRecordAction extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, user => user.edipi, {
    cascade: true,
    primary: true,
  })
  @JoinColumn({
    name: 'user_edipi',
  })
  user?: User;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  createdOn!: Date;

  @Column({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
    default: () => `now() + interval '1 day'`,
  })
  expiresOn!: Date;

  @Column({
    type: 'enum',
    enum: ActionType,
    default: ActionType.Ignore,
  })
  type!: ActionType;
}
