import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column, JoinColumn, ManyToOne, CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.model';
import { Org } from '../org/org.model';
import { Notification } from './notification.model';

@Entity()
export class UserNotificationSetting extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.edipi, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({
    name: 'user_edipi',
  })
  user?: User;

  @ManyToOne(() => Org, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @ManyToOne(() => Notification, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({
    name: 'notification_id',
  })
  notification?: Notification;

  @Column({
    type: 'integer',
    default: 1,
  })
  threshold: number = 1;

  @Column({
    type: 'integer',
    default: 60,
  })
  minMinutesBetweenAlerts: number = 60;

  @Column({
    type: 'integer',
    default: 0,
  })
  dailyCount: number = 0;

  @Column({
    type: 'integer',
    default: 24,
  })
  maxDailyCount: number = 24;

  @Column({
    default: false,
  })
  smsEnabled: boolean = false;

  @Column({
    default: false,
  })
  emailEnabled: boolean = false;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'null',
  })
  lastNotifiedDate?: Date;
}
