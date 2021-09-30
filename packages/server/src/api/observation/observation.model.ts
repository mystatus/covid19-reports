import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  baseObservationColumns,
  ColumnInfo,
  CustomColumns,
  getFullyQualifiedColumnName,
  getColumnSelect,
  MusterStatus,
} from '@covid19-reports/shared';
import { ReportSchema } from '../report-schema/report-schema.model';
import { Roster } from '../roster/roster.model';
import { timestampColumnTransformer } from '../../util/util';
import {
  EntityService,
  MakeEntity,
} from '../../util/entity-utils';
import { Org } from '../org/org.model';
import { UserRole } from '../user/user-role.model';
import { RosterHistory } from '../roster/roster-history.model';
import { MusterConfiguration } from '../muster/muster-config.model';

/**
 * Observation are created when users self-report COVID-19 symptoms via https://mystatus.mil/
 * This data is then replicated from the original storage to this entity.
 */
@MakeEntity()
@Entity()
export class Observation extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  // ID of the original document
  @Column({ length: 100, nullable: true, unique: true })
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

  @ManyToOne(() => MusterConfiguration)
  musterConfiguration?: MusterConfiguration;

  @Column({
    type: 'text',
    nullable: true,
  })
  musterWindowId!: string | null;

  @Column({
    type: 'enum',
    enum: MusterStatus,
    default: null,
    nullable: true,
  })
  musterStatus!: MusterStatus;

  @ManyToOne(() => RosterHistory)
  rosterHistoryEntry?: RosterHistory;

  static getColumnSelect(column: ColumnInfo) {
    return getColumnSelect(column, 'observation');
  }

  static async getColumns(org: Org, includeRelationships?: boolean, version?: string) {
    const reportSchema = await ReportSchema.findOne({
      where: {
        org: org.id,
        ...(version && { id: version }),
      },
    });

    if (!reportSchema) {
      throw new Error(`Report Schema '${version}' not defined for org '${org.id}'`);
    }

    const customColumns: ColumnInfo[] = reportSchema.columns;

    if (includeRelationships) {
      const service = new EntityService(RosterHistory);
      const rosterHistoryColumns = await service.getColumns(org);
      return [
        ...baseObservationColumns,
        ...customColumns,
        ...rosterHistoryColumns.map(columnInfo => ({
          ...columnInfo,
          table: 'roster',
        })),
      ];
    }
    return [...baseObservationColumns, ...customColumns];
  }

  // eslint-disable-next-line require-await
  static async buildSearchQuery(org: Org, userRole: UserRole, columns: ColumnInfo[]) {
    const queryBuilder = Observation.createQueryBuilder('observation').select([]);
    queryBuilder.leftJoin('observation.reportSchema', 'rs');

    queryBuilder.leftJoin(RosterHistory, 'roster', 'observation.roster_history_entry_id = roster.id');
    if (!userRole.allUnits) {
      queryBuilder.where(`roster.unit_id IN (${(await userRole.getUnits()).map(unit => unit.id).join(',')})`);
    }

    // Always select the id column
    queryBuilder.addSelect('observation.id', 'id');
    queryBuilder.addSelect('rs.id', 'reportSchema');

    // Add all columns that are allowed by the user's role
    columns.forEach(column => {
      const columnPath = getFullyQualifiedColumnName(column);

      if (column.table === 'roster') {
        queryBuilder.addSelect(Roster.getColumnSelect(column), columnPath);
      } else if (!column.table) {
        queryBuilder.addSelect(Observation.getColumnSelect(column), columnPath);
      }
    });

    queryBuilder.andWhere('rs.org_id = :orgId', { orgId: org.id });
    return queryBuilder;
  }

}
