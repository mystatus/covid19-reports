import {
  Entity,
  BaseEntity,
  Column, ManyToOne, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import { ReportSchema } from '../report-schema/report-schema.model';
import { Org } from '../org/org.model';
import { MusterFilter } from './muster-filter.model';

@Entity()
export class MusterConfiguration extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Org, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  org?: Org;

  @ManyToOne(() => ReportSchema, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  reportSchema?: ReportSchema;

  @Column({
    type: 'integer',
    nullable: true,
  })
  days!: number | null;

  @Column()
  startTime!: string;

  @Column()
  timezone!: string;

  @Column()
  durationMinutes!: number;

  @OneToMany(() => MusterFilter, musterFilter => musterFilter.musterConfig)
  filters?: MusterFilter[];

}
