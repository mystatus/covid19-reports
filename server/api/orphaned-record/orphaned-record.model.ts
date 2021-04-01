import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { InternalServerError } from '../../util/error-types';
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

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  createdOn!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  deletedOn?: Date;

  @BeforeInsert()
  setCompositeId() {
    if (!this.org?.id) {
      throw new InternalServerError('Org with id is required when creating an OrphanedRecord.');
    }
    if (!this.phone) {
      this.phone = '';
    }
    if (!this.unit) {
      this.unit = '';
    }
    this.compositeId = `${this.edipi};${this.org!.id};${this.phone};${this.unit}`;
  }
}
