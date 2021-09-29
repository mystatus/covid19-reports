import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ColumnInfo, ColumnType } from '@covid19-reports/shared';
import { Org } from '../org/org.model';

@Entity()
export class ReportSchema extends BaseEntity {

  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => Org, {
    primary: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column({
    length: 256,
  })
  name!: string;

  @Column('json', {
    nullable: false,
    default: '[]',
  })
  columns: SchemaColumn[] = [];

}

export type SchemaColumn = {
  keyPath: string[];
  otherField?: boolean;
} & ColumnInfo;

export const defaultReportSchemas: Partial<ReportSchema>[] = [{
  id: 'es6ddssymptomobs',
  name: 'Symptom Observation Report',
  columns: [{
    keyPath: ['Details', 'Affiliation'],
    name: 'Affiliation',
    displayName: 'Affiliation',
    type: ColumnType.String,
    pii: false,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'City'],
    name: 'City',
    displayName: 'City',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ConditionState'],
    name: 'ConditionState',
    displayName: 'Condition State',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Conditions'],
    name: 'Conditions',
    displayName: 'Conditions',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Confirmed'],
    name: 'Confirmed',
    displayName: 'Confirmed',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Exposures'],
    name: 'Exposures',
    displayName: 'Exposures',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Installation'],
    name: 'Installation',
    displayName: 'Installation',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Location'],
    name: 'Location',
    displayName: 'Location',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Lodging'],
    name: 'Lodging',
    displayName: 'Lodging',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Medications'],
    name: 'Medications',
    displayName: 'Medications',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'PhoneNumber'],
    name: 'PhoneNumber',
    displayName: 'Phone Number',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROM'],
    name: 'ROM',
    displayName: 'ROM',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROMContact'],
    name: 'ROMContact',
    displayName: 'ROM Contact',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROMStartDate'],
    name: 'ROMStartDate',
    displayName: 'ROM Start Date',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROMSupport'],
    name: 'ROMSupport',
    displayName: 'ROM Support',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'RoomNumber'],
    name: 'RoomNumber',
    displayName: 'Room Number',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Ship'],
    name: 'Ship',
    displayName: 'Ship',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'SpO2Percent'],
    name: 'Sp02Percent',
    displayName: 'Sp02 Percent',
    type: ColumnType.Number,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Symptoms'],
    name: 'Symptoms',
    displayName: 'Symptoms',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'TalkToSomeone'],
    name: 'TalkToSomeone',
    displayName: 'Talk To Someone',
    type: ColumnType.Number,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'TemperatureFahrenheit'],
    name: 'TemperatureFahrenheit',
    displayName: 'Temperature Fahrenheit',
    type: ColumnType.Number,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'TentOrBillet'],
    name: 'TentOrBillet',
    displayName: 'Tent Or Billet',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Unit'],
    name: 'Unit',
    displayName: 'Unit',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }],
}];
