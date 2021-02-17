import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn, Column,
} from 'typeorm';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';
import { timestampColumnTransformer } from '../../util/util';

export enum AccessRequestStatus {
  Pending = 'pending',
  Denied = 'denied',
}

@Entity()
export class AccessRequest extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.edipi, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_edipi',
  })
  user?: User;

  @ManyToOne(() => Org, org => org.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  requestDate!: Date;

  @Column({
    type: 'enum',
    enum: AccessRequestStatus,
    default: AccessRequestStatus.Pending,
  })
  status!: AccessRequestStatus;

}
