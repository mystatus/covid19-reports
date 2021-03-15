import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { timestampColumnTransformer } from '../../util/util';
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
    onDelete: 'CASCADE',
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
    nullable: true,
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  expiresOn?: Date;

  @Column({
    type: 'enum',
    enum: ActionType,
    default: ActionType.Ignore,
  })
  type!: ActionType;
}
