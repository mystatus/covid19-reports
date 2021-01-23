import {
  Entity,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
@Index(['org', 'name'], { unique: true })
export class Unit extends BaseEntity {

  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => Org, org => org.id, {
    nullable: false,
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column()
  name!: string;

  @Column('json', {
    nullable: true,
  })
  musterConfiguration?: MusterConfiguration[];
}

export interface MusterConfiguration {
  days: number,
  startTime: string,
  timezone: string,
  durationMinutes: number,
}
