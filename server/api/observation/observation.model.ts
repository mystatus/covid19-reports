import { Entity, Unique } from 'typeorm';
import { ObservationEntity } from './observation-entity';

/**
 * Observation are created when users self-report COVID-19 symptoms
 * via https://mystatus.mil/
 * This data is then replicated to this Observation entity.
 */
@Entity()
@Unique(['id', 'documentId'])
export class Observation extends ObservationEntity {
}
