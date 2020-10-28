import {
  Entity, Column, BaseEntity, JoinColumn, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
export class Roster extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Org, org => org.id, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column({
    length: 10,
  })
  edipi!: string;

  @Column({
    length: 100,
  })
  firstName!: string;

  @Column({
    length: 100,
  })
  lastName!: string;

  @Column({
    length: 50,
  })
  unit!: string;

  @Column({
    nullable: true,
    default: () => 'null',
  })
  startDate?: Date;

  @Column({
    nullable: true,
    default: () => 'null',
  })
  endDate?: Date;

  @CreateDateColumn({
    nullable: true,
    default: () => 'null',
  })
  lastReported?: Date;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  customColumns: CustomColumns;
}

export interface CustomColumns {
  [key: string]: CustomColumnValue
}

export type CustomColumnValue = string | boolean | number | null;

export enum RosterColumnType {
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
  DateTime = 'datetime',
  Number = 'number',
}

export interface RosterColumnInfo {
  name: string,
  displayName: string,
  type: RosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
}

export const baseRosterColumns: RosterColumnInfo[] = [
  {
    name: 'edipi',
    displayName: 'EDIPI',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  }, {
    name: 'firstName',
    displayName: 'First Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'lastName',
    displayName: 'Last Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'unit',
    displayName: 'Unit',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'startDate',
    displayName: 'Start Date',
    type: RosterColumnType.Date,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'endDate',
    displayName: 'End Date',
    type: RosterColumnType.Date,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'lastReported',
    displayName: 'Last Reported',
    type: RosterColumnType.DateTime,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  },
];
