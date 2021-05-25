import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
export class RosterHistoryBackup extends BaseEntity {

  @ManyToOne(() => Org, org => org.id, {
    nullable: false,
  })
  org!: Org;

  @Column()
  csv!: string;

  @CreateDateColumn()
  createdAt!: Date;

}
