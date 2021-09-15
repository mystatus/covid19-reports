import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { MusterConfiguration } from './muster-config.model';
import { SavedFilter } from '../saved-filter/saved-filter.model';

@Entity()
export class MusterFilter extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => MusterConfiguration, muster => muster.filters, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  musterConfig!: MusterConfiguration;

  @ManyToOne(() => SavedFilter, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  filter!: SavedFilter;

  @Column('json', {
    default: '{}',
    nullable: false,
  })
  filterParams!: {
    [key: string]: string;
  };

}
