import { MigrationInterface, QueryRunner } from 'typeorm';
import moment from 'moment';
import { Unit } from '../api/unit/unit.model';
import { CustomColumns } from '../api/roster/roster.types';
import { ChangeType, RosterHistory } from '../api/roster/roster-history.model';

export class RosterHistory1611025383465 implements MigrationInterface {
  name = 'RosterHistory1611025383465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "roster_history_change_type_enum" AS ENUM('added', 'changed', 'deleted')`);
    await queryRunner.query(`CREATE TABLE "roster_history" ("id" SERIAL NOT NULL, "edipi" character varying(10) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "custom_columns" json NOT NULL DEFAULT '{}', "timestamp" TIMESTAMP NOT NULL, "change_type" "roster_history_change_type_enum" NOT NULL DEFAULT 'changed', "unit_id" character varying NOT NULL, "unit_org" integer NOT NULL, CONSTRAINT "PK_1f540dcb3394b6f2f38f1091cc0" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_34e597fefbd4b9d5600513023fd" FOREIGN KEY ("unit_id", "unit_org") REFERENCES "unit"("id","org_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);

    const unitRepo = queryRunner.manager.getRepository(Unit);
    const rosterHistoryRepo = queryRunner.manager.getRepository(RosterHistory);
    const allUnits = await unitRepo.find({
      relations: ['org'],
    });

    // Migrate old roster entries to the history
    for (const unit of allUnits) {
      const unitRoster = (await queryRunner.query(`SELECT * FROM roster WHERE unit_id='${unit.id}' AND unit_org=${unit.org!.id} ORDER BY edipi ASC, id ASC`)) as OldRoster[];

      const unitHistory: RosterHistory[] = [];
      for (const entry of unitRoster) {
        if (unitHistory.length === 0
          || unitHistory[unitHistory.length - 1].edipi !== entry.edipi
          || (unitHistory[unitHistory.length - 1].changeType === ChangeType.Deleted
            && entry.start_date != null)) {
          const date = moment.utc(entry.start_date || 0);
          const addedRoster = new RosterHistory();
          addedRoster.unit = unit;
          addedRoster.edipi = entry.edipi;
          addedRoster.firstName = entry.first_name;
          addedRoster.lastName = entry.last_name;
          addedRoster.customColumns = entry.custom_columns;
          addedRoster.changeType = ChangeType.Added;
          addedRoster.timestamp = date.toDate();
          unitHistory.push(addedRoster);

          if (entry.end_date) {
            const deletedRoster = new RosterHistory();
            deletedRoster.unit = unit;
            deletedRoster.edipi = entry.edipi;
            deletedRoster.firstName = entry.first_name;
            deletedRoster.lastName = entry.last_name;
            deletedRoster.customColumns = entry.custom_columns;
            deletedRoster.changeType = ChangeType.Deleted;
            deletedRoster.timestamp = moment.utc(entry.end_date).endOf('day').toDate();
            unitHistory.push(deletedRoster);
          }
        }
      }
      await rosterHistoryRepo.save(unitHistory);
    }

    // Delete roster entries that are no longer on the roster
    await queryRunner.query(`DELETE FROM "roster" WHERE (end_date IS NOT NULL AND end_date < CURRENT_DATE)`);

    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "last_reported"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "end_date"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa" UNIQUE ("edipi", "unit_id", "unit_org")`);

    await queryRunner.query(rosterAuditTrigger);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_audit ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_audit_func');
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_truncate ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_truncate_func');
    await queryRunner.query(`ALTER TABLE "roster_history" DROP CONSTRAINT "FK_34e597fefbd4b9d5600513023fd"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "end_date" date`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "start_date" date`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "last_reported" TIMESTAMP`);
    await queryRunner.query(`DROP TABLE "roster_history"`);
    await queryRunner.query(`DROP TYPE "roster_history_change_type_enum"`);
  }

}

const rosterAuditTrigger = `
  CREATE OR REPLACE FUNCTION roster_audit_func() RETURNS TRIGGER AS $body$
    BEGIN
      IF (TG_OP = 'UPDATE') THEN
        INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, unit_org)
        VALUES (NEW.edipi, NEW.first_name, NEW.last_name, NEW.custom_columns, now(), 'changed', NEW.unit_id, NEW.unit_org);
        RETURN NEW;
      ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, unit_org)
        VALUES (OLD.edipi, OLD.first_name, OLD.last_name, OLD.custom_columns, now(), 'deleted', OLD.unit_id, OLD.unit_org);
        RETURN OLD;
      ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, unit_org)
        VALUES (NEW.edipi, NEW.first_name, NEW.last_name, NEW.custom_columns, now(), 'added', NEW.unit_id, NEW.unit_org);
        RETURN NEW;
      END IF;
      RETURN NULL;
    END;
  $body$
  LANGUAGE plpgsql;

  CREATE OR REPLACE FUNCTION roster_truncate_func() RETURNS TRIGGER AS $body$
    BEGIN
      IF (TG_OP = 'TRUNCATE') THEN
        INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, unit_org)
        SELECT edipi, first_name, last_name, custom_columns, now(), 'deleted', unit_id, unit_org
          FROM roster;
      END IF;
      RETURN NULL;
    END;
  $body$
  LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS roster_audit ON roster;

  CREATE TRIGGER roster_audit
    AFTER INSERT OR UPDATE OR DELETE ON roster
    FOR EACH ROW EXECUTE PROCEDURE roster_audit_func();

  DROP TRIGGER IF EXISTS roster_truncate ON roster;

  CREATE TRIGGER roster_truncate
    BEFORE TRUNCATE ON roster
    EXECUTE PROCEDURE roster_truncate_func();
`;

type OldRoster = {
  edipi: string,
  first_name: string,
  last_name: string,
  start_date: string | null,
  end_date: string | null,
  custom_columns: CustomColumns,
};
