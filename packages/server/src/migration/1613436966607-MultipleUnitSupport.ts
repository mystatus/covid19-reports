import { MigrationInterface, QueryRunner } from 'typeorm';
import { RosterHistory1611337083465 } from './1611337083465-RosterHistory';

export class MultipleUnitSupport1613436966607 implements MigrationInterface {

  name = 'MultipleUnitSupport1613436966607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role" ADD "all_units" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`CREATE TABLE "user_role_unit" ("user_role" integer NOT NULL, "unit" integer NOT NULL, CONSTRAINT "PK_772b5914223d720d1aee4e3e7c8" PRIMARY KEY ("user_role", "unit"))`);
    await queryRunner.query(`CREATE INDEX "IDX_97020bc8ce123b5a4a27e73962" ON "user_role_unit" ("user_role") `);
    await queryRunner.query(`CREATE INDEX "IDX_b44564e0f78b5335fd9d6939f5" ON "user_role_unit" ("unit") `);

    await queryRunner.query(`ALTER TABLE "unit" ADD "new_id" SERIAL NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD "new_unit_id" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "new_unit_id" integer NOT NULL DEFAULT 0`);
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_audit ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_audit_func()');
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_truncate ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_truncate_func()');

    const orgs = await queryRunner.query(`SELECT id FROM "org"`);
    for (const org of orgs) {
      const orgUnits = await queryRunner.query(`SELECT id, new_id FROM unit WHERE org_id=${org.id}`) as { id: string; new_id: number }[];
      const orgRoles = await queryRunner.query(`SELECT user_role.id, index_prefix FROM user_role LEFT JOIN "role" ON role_id = "role"."id" WHERE "role".org_id = ${org.id}`) as { id: number; index_prefix: string }[];
      for (const role of orgRoles) {
        if (role.index_prefix === '*') {
          await queryRunner.query(`UPDATE user_role SET all_units=true WHERE id=${role.id}`);
        } else {
          // for each unit that matches index prefix, insert into user_role_unit table
          for (const unit of orgUnits) {
            if (matchWildcardString(unit.id, role.index_prefix)) {
              await queryRunner.query(`INSERT INTO user_role_unit (user_role, unit) VALUES (${role.id}, ${unit.new_id})`);
            }
          }
        }
      }
      for (const unit of orgUnits) {
        await queryRunner.query(`UPDATE roster SET new_unit_id=${unit.new_id} WHERE unit_id='${unit.id}' AND unit_org=${org.id}`);
        await queryRunner.query(`UPDATE roster_history SET new_unit_id=${unit.new_id} WHERE unit_id='${unit.id}' AND unit_org=${org.id}`);
      }
    }

    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "index_prefix"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP CONSTRAINT "FK_34e597fefbd4b9d5600513023fd"`);

    await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "PK_a01b525274c7f20afb31a742d47"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "unit" RENAME "new_id" TO "id"`);
    await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "PK_a01b525274c7f20afb31a742d47" PRIMARY KEY ("id")`);

    await queryRunner.query(`ALTER TABLE "roster_history" ALTER COLUMN "new_unit_id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP COLUMN "unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP COLUMN "unit_org"`);
    await queryRunner.query(`ALTER TABLE "roster_history" RENAME "new_unit_id" TO "unit_id"`);

    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "new_unit_id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "unit_org"`);
    await queryRunner.query(`ALTER TABLE "roster" RENAME "new_unit_id" TO "unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa" UNIQUE ("edipi", "unit_id")`);

    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_34e597fefbd4b9d5600513023fd" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" ADD CONSTRAINT "FK_97020bc8ce123b5a4a27e739629" FOREIGN KEY ("user_role") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" ADD CONSTRAINT "FK_b44564e0f78b5335fd9d6939f55" FOREIGN KEY ("unit") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    await queryRunner.query(MultipleUnitSupport1613436966607.rosterAuditTrigger);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_audit ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_audit_func()');
    await queryRunner.query('DROP TRIGGER IF EXISTS roster_truncate ON roster');
    await queryRunner.query('DROP FUNCTION IF EXISTS roster_truncate_func()');
    await queryRunner.query(`DROP TABLE "query-result-cache"`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" DROP CONSTRAINT "FK_b44564e0f78b5335fd9d6939f55"`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" DROP CONSTRAINT "FK_97020bc8ce123b5a4a27e739629"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP CONSTRAINT "FK_34e597fefbd4b9d5600513023fd"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "PK_a01b525274c7f20afb31a742d47"`);

    await queryRunner.query(`ALTER TABLE "user_role" ADD "index_prefix" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "roster" ADD COLUMN "unit_org" INTEGER`);
    await queryRunner.query(`ALTER TABLE "roster" ADD COLUMN "new_unit_id" CHARACTER VARYING`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD COLUMN "unit_org" INTEGER`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD COLUMN "new_unit_id" CHARACTER VARYING`);
    await queryRunner.query(`ALTER TABLE "unit" ADD "new_id" CHARACTER VARYING`);

    const orgs = await queryRunner.query(`SELECT id FROM "org"`);
    for (const org of orgs) {
      const orgUnits = await queryRunner.query(`SELECT id FROM unit WHERE org_id=${org.id}`) as { id: string }[];
      const orgRoles = await queryRunner.query(`SELECT user_role.id, user_role.all_units FROM user_role LEFT JOIN "role" ON role_id = "role"."id" WHERE "role".org_id = ${org.id}`) as { id: number; all_units: boolean }[];
      for (const role of orgRoles) {
        if (role.all_units) {
          await queryRunner.query(`UPDATE user_role SET index_prefix='*' WHERE id=${role.id}`);
        } else {
          const units = await queryRunner.query(`SELECT unit FROM user_role_unit WHERE user_role=${role.id}`) as { unit: number }[];
          if (units && units.length > 0) {
            // Going back to single unit support, so just allow the first unit.
            await queryRunner.query(`UPDATE user_role SET index_prefix='${units[0].unit}' WHERE id=${role.id}`);
          }
        }
      }
      for (const unit of orgUnits) {
        await queryRunner.query(`UPDATE unit SET new_id='${unit.id}' WHERE id=${unit.id}`);
        await queryRunner.query(`UPDATE roster SET new_unit_id='${unit.id}', unit_org=${org.id} WHERE unit_id=${unit.id}`);
        await queryRunner.query(`UPDATE roster_history SET new_unit_id='${unit.id}', unit_org=${org.id} WHERE unit_id=${unit.id}`);
      }
    }

    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster" RENAME "new_unit_id" TO "unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa" UNIQUE ("edipi", "unit_id", "unit_org")`);

    await queryRunner.query(`ALTER TABLE "roster_history" DROP COLUMN "unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster_history" RENAME "new_unit_id" TO "unit_id"`);

    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "all_units"`);

    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "unit" RENAME "new_id" TO "id"`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "PK_a01b525274c7f20afb31a742d47" PRIMARY KEY ("org_id", "id")`);

    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5" FOREIGN KEY ("unit_org", "unit_id") REFERENCES "unit"("org_id","id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_34e597fefbd4b9d5600513023fd" FOREIGN KEY ("unit_org", "unit_id") REFERENCES "unit"("org_id","id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`DROP INDEX "IDX_b44564e0f78b5335fd9d6939f5"`);
    await queryRunner.query(`DROP INDEX "IDX_97020bc8ce123b5a4a27e73962"`);
    await queryRunner.query(`DROP TABLE "user_role_unit"`);
    await queryRunner.query(RosterHistory1611337083465.rosterAuditTrigger);
  }

  static rosterAuditTrigger = `
    CREATE OR REPLACE FUNCTION roster_audit_func() RETURNS TRIGGER AS $body$
      BEGIN
        IF (TG_OP = 'UPDATE') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id)
          VALUES (NEW.edipi, NEW.first_name, NEW.last_name, NEW.custom_columns, now(), 'changed', NEW.unit_id);
          RETURN NEW;
        ELSIF (TG_OP = 'DELETE') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id)
          VALUES (OLD.edipi, OLD.first_name, OLD.last_name, OLD.custom_columns, now(), 'deleted', OLD.unit_id);
          RETURN OLD;
        ELSIF (TG_OP = 'INSERT') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id)
          VALUES (NEW.edipi, NEW.first_name, NEW.last_name, NEW.custom_columns, now(), 'added', NEW.unit_id);
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
    $body$
    LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION roster_truncate_func() RETURNS TRIGGER AS $body$
      BEGIN
        IF (TG_OP = 'TRUNCATE') THEN
          INSERT INTO roster_history (edipi, first_name, last_name, custom_columns, "timestamp", change_type, unit_id)
          SELECT edipi, first_name, last_name, custom_columns, now(), 'deleted', unit_id
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

function matchWildcardString(str: string, pattern: string) {
  const escapeRegex = (part: string) => part.replace(/([.*+?^=!:${}()|[]\/\\])/g, '\\$1');
  return new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`).test(str);
}
