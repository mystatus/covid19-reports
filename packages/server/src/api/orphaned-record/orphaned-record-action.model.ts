import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrphanedRecordActionType } from '@covid19-reports/shared';
import { timestampColumnTransformer } from '../../util/util';
import { User } from '../user/user.model';

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
    enum: OrphanedRecordActionType,
    default: OrphanedRecordActionType.Ignore,
  })
  type!: OrphanedRecordActionType;

}
