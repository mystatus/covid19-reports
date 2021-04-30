import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntityManager,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { InternalServerError } from '../../util/error-types';
import { reingestByDocumentId } from '../../util/reingest-utils';
import { getRosterHistoryForIndividual } from '../../util/roster-utils';
import { timestampColumnTransformer } from '../../util/util';
import { Org } from '../org/org.model';
import { RosterEntity } from '../roster/roster-entity';
import { OrphanedRecordAction } from './orphaned-record-action.model';

@Entity()
export class OrphanedRecord extends BaseEntity {
  @PrimaryColumn()
  documentId!: string;

  // Due to the irregular nature of the join to actions table, we
  // define this single compositeId, used as a more efficient identifier
  // and to allow more readable join.
  @Column()
  compositeId!: string;

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
  unit!: string;

  @Column()
  phone!: string;

  @Column({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  timestamp!: Date;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  createdOn!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    transformer: timestampColumnTransformer,
  })
  deletedOn?: Date;

  @BeforeInsert()
  setCompositeId() {
    if (!this.org?.id) {
      throw new InternalServerError('Org with id is required when creating an OrphanedRecord.');
    }
    if (!this.phone) {
      this.phone = '';
    }
    if (!this.unit) {
      this.unit = '';
    }
    this.compositeId = `${this.edipi};${this.org!.id};${this.phone};${this.unit}`;
  }

  async resolve(entry: RosterEntity, manager: EntityManager) {
    await this.backdateRosterHistory(entry, manager);

    await manager.softRemove(this);

    await this.deleteActions(manager);

    // Request a reingestion of a single document. Don't await on this since it may take a while
    // and can safely run in the background.
    reingestByDocumentId(this.documentId).then();
  }

  private deleteActions(manager: EntityManager) {
    return manager.createQueryBuilder()
      .delete()
      .from(OrphanedRecordAction)
      .where(`id=:id`, { id: this.compositeId })
      .orWhere('expires_on < now()')
      .execute();
  }

  private async backdateRosterHistory(entry: RosterEntity, manager: EntityManager) {
    const rosterHistory = await getRosterHistoryForIndividual(this.edipi, entry.unit.id);
    if (!rosterHistory.length) {
      throw new InternalServerError('Unable to locate RosterHistory record.');
    }

    let timestamp = this.timestamp.getTime();

    for (const historyEntry of rosterHistory) {
      // Only update history entries that were after the orphaned record's timestamp.
      historyEntry.timestamp = new Date(
        Math.min(historyEntry.timestamp.getTime(), timestamp),
      );

      // Ensure that two records don't have the same value
      timestamp -= 1;
    }

    await manager.save(rosterHistory);
  }

}

