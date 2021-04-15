import {
  Entity,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import _ from 'lodash';
import { Org } from '../org/org.model';
import { baseRosterColumns } from './roster-entity';
import { RosterColumnType } from './roster.types';

@Entity()
export class CustomRosterColumn extends BaseEntity {

  @PrimaryColumn()
  name!: string;

  @ManyToOne(() => Org, org => org.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column({
    length: 100,
  })
  display!: string;

  @Column({
    type: 'enum',
    enum: RosterColumnType,
    default: RosterColumnType.String,
  })
  type!: RosterColumnType;

  @Column({
    default: false,
  })
  pii!: boolean;

  @Column({
    default: false,
  })
  phi!: boolean;

  @Column({
    default: false,
  })
  required!: boolean;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  config!: CustomColumnConfig;

  @BeforeInsert()
  async beforeInsert() {
    this.name = CustomRosterColumn.displayToName(this.display);

    const existingColumn = await CustomRosterColumn.findOne({
      where: {
        name: this.name,
        org: this.org!.id,
      },
    });

    if (existingColumn || this.name === 'unit' || baseRosterColumns.some(x => x.name === this.name)) {
      throw new Error(`A roster column with that name already exists.`);
    }
  }

  @BeforeUpdate()
  beforeUpdate() {
    const updatedName = CustomRosterColumn.displayToName(this.display);
    if (updatedName !== this.name) {
      throw new Error(`Roster column name cannot be changed!`);
    }
  }

  setFromData(data: CustomColumnData) {
    if (data.displayName) {
      this.display = data.displayName;
    }
    if (data.type) {
      this.type = data.type;
    }
    if (data.pii != null) {
      this.pii = data.pii;
    }
    if (data.phi != null) {
      this.phi = data.phi;
    }
    if (data.required != null) {
      this.required = data.required;
    }
    if (data.config != null) {
      this.config = data.config;
    }
  }

  static displayToName(display: string) {
    return _.camelCase(display);
  }
}

export type CustomColumnData = Partial<Pick<CustomRosterColumn, 'type' | 'pii' | 'phi' | 'required' | 'config'>> & {
  displayName?: string
};

export interface CustomColumnConfig {}
