import {
  Entity,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Org } from '../org/org.model';


export enum EntityType {
  Observation = 'Observation',
  RosterEntry = 'RosterEntry',
}

@Entity()
@Index(['org', 'name'], { unique: true })
export class SavedFilter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Org, org => org.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column()
  name!: string;

  @Column()

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entityType!: EntityType;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  filterConfiguration!: FilterConfiguration;
}

export interface FilterConfiguration {
  [column: string]: {
    op: string,
    value: unknown,
  }
}
