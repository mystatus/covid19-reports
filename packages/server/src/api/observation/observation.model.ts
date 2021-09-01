import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { startCase } from 'lodash';
import { baseObservationColumns, ColumnInfo, ColumnType, CustomColumns } from '@covid19-reports/shared';
import { ReportSchema } from '../report-schema/report-schema.model';
import { Roster } from '../roster/roster.model';
import { timestampColumnTransformer } from '../../util/util';
import {
  getColumnSelect,
  EntityService,
  MakeEntity,
} from '../../util/entity-utils';
import { Org } from '../org/org.model';
import { UserRole } from '../user/user-role.model';

/**
 * Observation are created when users self-report COVID-19 symptoms via https://mystatus.mil/
 * This data is then replicated from the original storage to this entity.
 */
@MakeEntity()
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
  @Index('observation-edipi')
  @Column({ length: 10 })
  edipi!: string;

  // timestamp when the observation was reported
  @Index('observation-timestamp')
  @Column({ type: 'timestamp', transformer: timestampColumnTransformer })
  timestamp!: Date;

  // type of the observation symptoms
  @ManyToOne(() => ReportSchema, { onDelete: 'RESTRICT' })
  reportSchema?: ReportSchema;

  // military unit
  @Index('observation-unit')
  @Column({ length: 300 })
  unit!: string;

  @Column({ length: 100, nullable: true })
  reportingGroup?: string;


  @Column('json', {
    nullable: false,
    default: '{}',
  })
  customColumns!: CustomColumns;


  static getColumnSelect(column: ColumnInfo) {
    return getColumnSelect(column, 'custom_columns', 'observation');
  }

  static async getColumns(org: Org, version?: string) {
    const reportSchema = await ReportSchema.findOne({
      where: {
        org: org.id,
        id: version,
      },
    });

    if (!reportSchema) {
      throw new Error(`Report Schema '${version}' not defined for org '${org.id}'`);
    }

    const customColumns: ColumnInfo[] = reportSchema.columns.map(column => ({
      name: column.keyPath.join(''),
      displayName: startCase(column.keyPath[column.keyPath.length - 1]),
      type: ['long', 'float'].includes(column.type) ? ColumnType.Number : ColumnType.String,
      pii: column.pii,
      phi: column.phi,
      custom: true,
      required: false,
      updatable: false,
    }));

    const service = new EntityService(Roster);
    if (version) {
      const joinColumns = (await service.getColumns(org, version)).map((columnInfo: ColumnInfo) => {
        return {
          ...columnInfo,
          table: 'roster',
        };
      });
      return [...baseObservationColumns, ...customColumns, ...joinColumns];
    }
    return [...baseObservationColumns, ...customColumns];
  }

  // eslint-disable-next-line require-await
  static async buildSearchQuery(org: Org, userRole: UserRole, columns: ColumnInfo[]) {
    const queryBuilder = Observation.createQueryBuilder('observation').select([]);
    queryBuilder.leftJoin('observation.reportSchema', 'rs');
    queryBuilder.leftJoin(Roster, 'roster', `observation.edipi = roster.edipi`);

    // Always select the id column
    queryBuilder.addSelect('observation.id', 'id');
    queryBuilder.addSelect('rs.id', 'reportSchema');

    // Add all columns that are allowed by the user's role
    columns.forEach(column => {
      queryBuilder.addSelect(Observation.getColumnSelect(column), column.name);
    });

    queryBuilder.where('rs.org_id = :orgId', { orgId: org.id });

    return queryBuilder;
  }

}
