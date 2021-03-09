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

@Entity()
@Index(['org', 'name'], { unique: true })
export class Unit extends BaseEntity {
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

  @Column({
    default: true,
  })
  includeDefaultConfig: boolean;

  @Column('json', {
    nullable: false,
    default: '[]',
  })
  musterConfiguration: MusterConfiguration[] = [];

  combinedConfiguration() {
    if (this.includeDefaultConfig) {
      if (!this.org || !Array.isArray(this.org?.defaultMusterConfiguration)) {
        throw new Error('Unit needs the complete org entity to access the defaultMusterConfig');
      }
      return [...this.org?.defaultMusterConfiguration, ...this.musterConfiguration];
    }
    return this.musterConfiguration;
  }
}

export interface MusterConfiguration {
  days?: number,
  startTime: string,
  timezone: string,
  durationMinutes: number,
  reportId: string,
}
