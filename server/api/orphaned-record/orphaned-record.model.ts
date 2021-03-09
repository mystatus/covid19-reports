import {
  Entity,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { timestampColumnTransformer } from '../../util/util';
import { Org } from '../org/org.model';

@Entity()
export class OrphanedRecord extends BaseEntity {
  @PrimaryColumn()
  documentId!: string;

  // Due to the irregular nature of the join to actions table, we
  // define this single compositeId, used as a more efficient identifier
  // and to allow more readable join.
  @Column()
  compositeId!: string;

  @Column({
    length: 10,
  })
  edipi!: string;

  @ManyToOne(() => Org, org => org.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column()
  unit: string;

  @Column()
  phone: string;

  @Column({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  timestamp!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  deletedOn?: Date;

  @BeforeInsert()
  setCompositeId() {
    this.compositeId = `${this.edipi};${this.org!.id};${this.phone};${this.unit}`;
  }
}
