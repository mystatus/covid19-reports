import {
  Entity,
  BaseEntity,
  Column, PrimaryColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {

  @PrimaryColumn()
  id!: string;

  @Column({
    type: 'double precision',
  })
  uiSort!: number;

  @Column()
  uiName!: string;

  @Column()
  uiDescription!: string;

  // Template for displaying user notification settings for the notification
  @Column()
  uiSettingsTemplate!: string;

  @Column()
  smsTemplate!: string;

  @Column()
  emailTextTemplate!: string;

  @Column()
  emailHtmlTemplate!: string;

  @Column({
    type: 'integer',
    default: 1,
  })
  defaultThreshold: number = 1;

  @Column({
    type: 'integer',
    default: 24,
  })
  defaultMaxDailyCount: number = 24;

  // Minimum time between alerts (in minutes)
  @Column({
    type: 'integer',
    default: 60,
  })
  defaultMinTimeBetweenAlerts: number = 60;

  @Column({
    nullable: true,
  })
  dashboardUuid?: string;

}
