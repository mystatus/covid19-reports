import { MigrationInterface, QueryRunner } from 'typeorm';
import { MultipleUnitSupport1613436966607 } from './1613436966607-MultipleUnitSupport';

export class UniqueEdipi1633041649823 implements MigrationInterface {

  name = 'UniqueEdipi1633041649823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_b475b22c00b1274d9642a2f6357"`);

    await queryRunner.query('DROP TRIGGER IF EXISTS roster_audit ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_audit_func()');
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_truncate ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_truncate_func()');

    await queryRunner.query(`ALTER TABLE "roster_history" ADD "org_id" integer`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "org_id" integer`);
    await queryRunner.query(`UPDATE roster_history SET org_id=unit.org_id FROM unit WHERE roster_history.unit_id = unit.id`);
    await queryRunner.query(`UPDATE roster SET org_id=unit.org_id FROM unit WHERE roster.unit_id = unit.id`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "org_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster_history" ALTER COLUMN "org_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_6d3bc54502350051de7e30cfb91" UNIQUE ("org_id", "edipi")`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_461315c115e5f9892779f2cf9e3" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(UniqueEdipi1633041649823.rosterAuditTrigger);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_audit ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_audit_func()');
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_truncate ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_truncate_func()');
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP CONSTRAINT "FK_461315c115e5f9892779f2cf9e3"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_6d3bc54502350051de7e30cfb91"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "org_id"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP COLUMN "org_id"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_b475b22c00b1274d9642a2f6357" UNIQUE ("edipi", "unit_id")`);
    await queryRunner.query(MultipleUnitSupport1613436966607.rosterAuditTrigger);
  }

  static rosterAuditTrigger = `
    CREATE OR REPLACE FUNCTION roster_audit_func() RETURNS TRIGGER AS $body$
      BEGIN
        IF (TG_OP = 'UPDATE') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, org_id)
          VALUES (NEW.edipi, NEW.first_name, NEW.last_name, NEW.custom_columns, now(), 'changed', NEW.unit_id, NEW.org_id);
          RETURN NEW;
        ELSIF (TG_OP = 'DELETE') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, org_id)
          VALUES (OLD.edipi, OLD.first_name, OLD.last_name, OLD.custom_columns, now(), 'deleted', OLD.unit_id, OLD.org_id);
          RETURN OLD;
        ELSIF (TG_OP = 'INSERT') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, org_id)
          VALUES (NEW.edipi, NEW.first_name, NEW.last_name, NEW.custom_columns, now(), 'added', NEW.unit_id, NEW.org_id);
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
    $body$
    LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION roster_truncate_func() RETURNS TRIGGER AS $body$
      BEGIN
        IF (TG_OP = 'TRUNCATE') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id, org_id)
          SELECT edipi, first_name, last_name, custom_columns, now(), 'deleted', unit_id, org_id
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

}
