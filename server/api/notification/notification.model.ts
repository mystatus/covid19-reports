import {
  Entity,
  BaseEntity,
  Column, PrimaryColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {

  @PrimaryColumn()
  id!: string;

  // This is a double precision field to allow new notifications to be added to the UI at any point without needing to
  // re-write every other notification sort value.
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

  @Column({
    type: 'integer',
    default: 60,
  })
  defaultMinMinutesBetweenAlerts: number = 60;

  @Column({
    nullable: true,
  })
  dashboardUuid?: string;

}
