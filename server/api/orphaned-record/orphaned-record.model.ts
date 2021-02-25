import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { timestampColumnTransformer } from '../../util/util';
import { Org } from '../org/org.model';

@Entity()
export class OrphanedRecord extends BaseEntity {
  @PrimaryColumn()
  documentId!: string;

  @Column()
  joinKey!: string;

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

  // @CreateDateColumn({
  //   type: 'timestamp',
  //   transformer: timestampColumnTransformer,
  // })
  // createdOn!: Date;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
    nullable: true,
    default: () => 'null',
  })
  deletedOn?: Date;

  @BeforeInsert()
  setJoinKey() {
    this.joinKey = `${this.edipi};${this.org!.id};${this.phone};${this.unit}`;
  }
}
