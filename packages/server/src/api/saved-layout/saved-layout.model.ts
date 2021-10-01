import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ActionsConfig,
  ColumnsConfig,
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
export class SavedLayout extends BaseEntity {

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
  columns!: ColumnsConfig;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  actions!: ActionsConfig;

  static async getAllowedSavedLayouts(org: Org, role: Role, entityType?: EntityType) {
    const savedLayouts = await SavedLayout.find({
      relations: ['org'],
      where: {
        org: org.id,
        ...(entityType && { entityType }),
      },
      order: { name: 'ASC' },
    });

    const entityColumnLookup = await buildEntityColumnLookup(org);

    return savedLayouts
      .filter(savedLayout => {
        const { pii, phi } = getRequiredPermissionsForColumns(savedLayout.columns, entityColumnLookup);
        const reject = (pii && !role.canViewPII) || (phi && !role.canViewPHI);
        return !reject;
      });
  }

}
