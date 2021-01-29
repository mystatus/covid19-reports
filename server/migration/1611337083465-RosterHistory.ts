import { MigrationInterface, QueryRunner } from 'typeorm';
import moment from 'moment';

export class RosterHistory1611337083465 implements MigrationInterface {
  name = 'RosterHistory1611337083465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "roster_history_change_type_enum" AS ENUM('added', 'changed', 'deleted')`);
    await queryRunner.query(`CREATE TABLE "roster_history" ("id" SERIAL NOT NULL, "edipi" character varying(10) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "custom_columns" json NOT NULL DEFAULT '{}', "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "change_type" "roster_history_change_type_enum" NOT NULL DEFAULT 'changed', "unit_id" character varying NOT NULL, "unit_org" integer NOT NULL, CONSTRAINT "PK_1f540dcb3394b6f2f38f1091cc0" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_34e597fefbd4b9d5600513023fd" FOREIGN KEY ("unit_id", "unit_org") REFERENCES "unit"("id","org_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);

    const allUnits = await queryRunner.query(`SELECT id, org_id FROM unit`);

    // Migrate old roster entries to the history
    for (const unit of allUnits) {
      const unitRoster = (await queryRunner.query(`SELECT * FROM roster WHERE unit_id='${unit.id}' AND unit_org=${unit.org_id} ORDER BY edipi ASC, id ASC`)) as OldRoster[];

      const unitHistory: RosterHistoryRow[] = [];
      for (const entry of unitRoster) {
        if (unitHistory.length === 0
          || unitHistory[unitHistory.length - 1].edipi !== entry.edipi
          || (unitHistory[unitHistory.length - 1].change_type === HistoryChangeType.Deleted
            && entry.start_date != null)) {
          const date = moment.utc(entry.start_date || 0).startOf('day');
          const addedRoster: RosterHistoryRow = {
            unit_id: unit.id,
            unit_org: unit.org_id,
            edipi: entry.edipi,
            first_name: entry.first_name,
            last_name: entry.last_name,
            custom_columns: entry.custom_columns,
            change_type: HistoryChangeType.Added,
            timestamp: date.toDate(),
          };
          unitHistory.push(addedRoster);

          if (entry.end_date) {
            const deletedRoster: RosterHistoryRow = {
              unit_id: unit.id,
              unit_org: unit.org_id,
              edipi: entry.edipi,
              first_name: entry.first_name,
              last_name: entry.last_name,
              custom_columns: entry.custom_columns,
              change_type: HistoryChangeType.Deleted,
              timestamp: moment.utc(entry.end_date).endOf('day').toDate(),
            };
            unitHistory.push(deletedRoster);
          }
        }
      }
      for (const row of unitHistory) {
        await queryRunner.query(`
          INSERT INTO roster_history (unit_id, unit_org, edipi, first_name, last_name, custom_columns, change_type, timestamp)
          VALUES ('${row.unit_id}', ${row.unit_org}, '${row.edipi}', '${row.first_name}', '${row.last_name}',
            '${JSON.stringify(row.custom_columns)}', '${row.change_type}', to_timestamp(${row.timestamp.getTime() / 1000}))
        `);
      }
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

interface CustomColumns {
  [key: string]: CustomColumnValue
}

export type CustomColumnValue = string | boolean | number | null;

type OldRoster = {
  edipi: string,
  first_name: string,
  last_name: string,
  start_date: string | null,
  end_date: string | null,
  custom_columns: CustomColumns,
};

enum HistoryChangeType {
  Added = 'added',
  Changed = 'changed',
  Deleted = 'deleted',
}

type RosterHistoryRow = {
  unit_id: string,
  unit_org: number,
  edipi: string,
  first_name: string,
  last_name: string,
  custom_columns: CustomColumns,
  timestamp: Date,
  change_type: HistoryChangeType
};
