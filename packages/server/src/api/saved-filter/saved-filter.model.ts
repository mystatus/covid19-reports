import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  FilterConfig,
  EntityType,
  entityTypes,
} from '@covid19-reports/shared';
import { Org } from '../org/org.model';

@Entity()
@Index(['org', 'name', 'entityType'], { unique: true })
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
    enum: entityTypes,
  })
  entityType!: EntityType;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  config!: FilterConfig;

}
