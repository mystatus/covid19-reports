import { BaseEntity, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['type'])
export class ObservationType extends BaseEntity {

  @PrimaryColumn({ length: 100 })
  type!: string;
}
