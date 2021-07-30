import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ReportSchema } from '../report-schema/report-schema.model';
import { timestampColumnTransformer } from '../../util/util';

/**
 * Observation are created when users self-report COVID-19 symptoms via https://mystatus.mil/
 * This data is then replicated from the original storage to this entity.
 */
@Entity()
@Unique(['id', 'documentId'])
export class Observation extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  // ID of the original document
  @Column({ length: 100 })
  documentId!: string;

  /* DOD unique ID that is associated with personnel and their CAC card.
  We don't maintain the list of these IDs so there is no integrity constraint (foreign key).
  */
  @Column({ length: 10 })
  edipi!: string;

  // timestamp when the observation was reported
  @Column({ type: 'timestamp', transformer: timestampColumnTransformer })
  timestamp!: Date;

  // type of the observation symptoms
  @ManyToOne(() => ReportSchema, { onDelete: 'RESTRICT' })
  reportSchema!: ReportSchema;

  // military unit
  @Column({ length: 300 })
  unit!: string;

  @Column({ length: 100, nullable: true})
  reportingGroup?: string;
}

