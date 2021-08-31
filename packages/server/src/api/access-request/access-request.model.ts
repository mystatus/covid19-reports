import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { formatPhoneNumber } from '@covid19-reports/shared';
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
    type: 'varchar',
    array: true,
  })
  whatYouDo!: string[];

  @Index('access-request-sponsorName')
  @Column()
  sponsorName!: string;

  @Column()
  sponsorEmail!: string;

  @Column()
  sponsorPhone!: string;

  @Column()
  justification!: string;

  @Column({
    type: 'enum',
    enum: AccessRequestStatus,
    default: AccessRequestStatus.Pending,
  })
  status!: AccessRequestStatus;

  @BeforeInsert()
  @BeforeUpdate()
  formatPhoneNumber() {
    this.sponsorPhone = formatPhoneNumber(this.sponsorPhone);
  }

}
