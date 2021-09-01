import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActionsConfig, ColumnsConfig, EntityType, PinTarget } from '@covid19-reports/shared';
import { Org } from '../org/org.model';

@Entity()
@Index(['org', 'name', 'entityType'], { unique: true })
export class SavedLayout extends BaseEntity {

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
    enum: EntityType,
  })
  entityType!: EntityType;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  columns!: ColumnsConfig;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  actions!: ActionsConfig;

  @Column({
    nullable: true,
    type: 'enum',
    enum: PinTarget
  })
  pinTarget?: PinTarget;
}
