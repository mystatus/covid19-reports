import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
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
  @Column({
    nullable: false,
    length: 10,
    primary: true,
  })
  edipi!: string;

  @ManyToOne(() => User, user => user.edipi, {
    cascade: true,
    primary: true,
  })
  @JoinColumn({
    name: 'user_edipi',
  })
  user?: User;

  @ManyToOne(() => Org, org => org.id, {
    cascade: true,
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  createdOn!: Date;

  @Column({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  expiresOn!: Date;

  @Column({
    type: 'enum',
    enum: ActionType,
    default: ActionType.Ignore,
  })
  type!: ActionType;
}
