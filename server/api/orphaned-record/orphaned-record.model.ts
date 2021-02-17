import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { timestampColumnTransformer } from '../../util/util';
import { Org } from '../org/org.model';
import { OrphanedRecordAction } from './orphaned-record-action.model';

@Entity()
export class OrphanedRecord extends BaseEntity {
  @Column({
    length: 10,
    primary: true,
  })
  edipi!: string;

  @ManyToOne(() => Org, org => org.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @CreateDateColumn({
    primary: true,
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  createdOn!: Date;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  report!: IngestProcessor.BaseReport;

  actions: OrphanedRecordAction[];
}

export declare namespace IngestProcessor {
  export interface MusterWindow {
    id: string;
    orgId: string;
    unitId: string;
    startTimestamp: number;
    endTimestamp: number;
    startTime: string;
    timezone: string;
    durationMinutes: number;
    status: 'EARLY' | 'ON_TIME' | 'LATE' | 'NON_REPORTING';
    reported: boolean;
  }

  export interface BaseReport {
    ID: string;
    EDIPI: string;
    Timestamp: number;
    ReportingGroup?: string;
    type: string;
    API: {
      ID: string;
      Resource: string;
      Stage: string;
    };
    Browser: {
      Locale: string;
      Timestamp: number;
      TimeZone: string;
      UserAgent: string;
    };
    Client?: {
      Application: string;
      Environment: string;
      GitCommit: string;
      Origin: string;
    };
    Model: {
      Version: string;
    };
    Muster?: MusterWindow;
  }

  export interface SymptomObservationReport extends BaseReport {
    Score: number;
    Category: string;
    Details?: {
      Conditions: string;
      Confirmed: number;
      Lodging: string;
      PhoneNumber: string;
      Symptoms: string;
      TalkToSomeone: number;
      TemperatureFahrenheit: number;
      Unit: string;
    };
  }
}


export function isSymptomObservationReport(report: IngestProcessor.SymptomObservationReport | IngestProcessor.BaseReport): report is IngestProcessor.SymptomObservationReport {
  return (report as IngestProcessor.SymptomObservationReport).Details !== undefined;
}

export const applicationMapping: {[key: string]: string} = {
  dawn: 'trsg',
  goose: 'cnal',
  hawkins: 'nsw',
  manta: 'csp',
  padawan: 'nbsd',
  roadrunner: 'nmtsc',
  niima: 'cldj',
  nashal: 'nhfl',
  corvair: 'ccsg',
  crix: 'arng',
  nova: 'necc',
  fondor: 'usff',
  wurtz: 'c7f',
  jun: 'oki',
  jerjerrod: 'naveur',
  javaal: 'usaf',
  sabaoth: 'usaf',
  trando: 'usn_embark',
  crait: 'first_army_test',
  coronet: 'c19_test',
} as const;
