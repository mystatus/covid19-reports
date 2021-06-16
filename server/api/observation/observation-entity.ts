import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';


export class ObservationEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  // ID of the original document
  @Column({ length: 100 })
  documentId!: string;

  // DOD unique ID that is associated with personnel and their CAC card
  @Column({ length: 10 })
  edipi!: string;

  // timestamp when the observation was reported
  @Column({ length: 50 })
  timestamp!: number;

  // report type
  // TODO: what are the acceptable values?
  // TODO: is this a foreign key?
  @Column({ length: 50 })
  reportType!: string;

  // military unit description
  // TODO: is this a foreign key?
  @Column({ length: 50 })
  unitId?: string;

  // military unit description
  @Column({ length: 100 })
  unit?: string;

  // military organization ID
  @Column({ length: 50 })
  orgId!: string;

  // TODO: other universal fields...TBD

}
