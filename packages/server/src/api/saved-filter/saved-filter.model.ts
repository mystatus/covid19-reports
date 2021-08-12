import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  FilterEntityType,
  FilterConfig,
} from '@covid19-reports/shared';
import { Org } from '../org/org.model';

@Entity()
@Index(['org', 'name'], { unique: true })
export class SavedFilter extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Org, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  org?: Org;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: FilterEntityType,
  })
  entityType!: FilterEntityType;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  config!: FilterConfig;

}
