import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  FilterConfig,
  EntityType,
  entityTypes,
} from '@covid19-reports/shared';
import { Org } from '../org/org.model';
import { Role } from '../role/role.model';
import {
  buildEntityColumnLookup,
  getRequiredPermissionsForColumns,
} from '../../util/entity-column-utils';

@Entity()
@Index(['org', 'name', 'entityType'], { unique: true })
export class SavedFilter extends BaseEntity {

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
    enum: entityTypes,
  })
  entityType!: EntityType;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  config!: FilterConfig;

  static async getAllowedSavedFilters(org: Org, role: Role, entityType?: EntityType) {
    const savedFilters = await SavedFilter.find({
      relations: ['org'],
      where: {
        org: org.id,
        ...(entityType && { entityType }),
      },
      order: { name: 'ASC' },
    });

    const entityColumnLookup = await buildEntityColumnLookup(org);

    return savedFilters
      .filter(savedFilter => {
        const { pii, phi } = getRequiredPermissionsForColumns(savedFilter.config, entityColumnLookup);
        const reject = (pii && !role.canViewPII) || (phi && !role.canViewPHI);
        return !reject;
      });
  }

}
