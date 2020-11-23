import { MigrationInterface, QueryRunner } from 'typeorm';
import { Unit } from '../api/unit/unit.model';
import { Org } from '../api/org/org.model';
import { sanitizeIndexPrefix } from '../util/util';

export class Units1605641172821 implements MigrationInterface {
  name = 'Units1605641172821'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "unit" ("id" character varying NOT NULL, "name" character varying NOT NULL, "muster_configuration" json NOT NULL DEFAULT '[]', "org_id" integer NOT NULL, CONSTRAINT "PK_a01b525274c7f20afb31a742d47" PRIMARY KEY ("id", "org_id"))`);

    await queryRunner.query(`ALTER TABLE "roster" ADD "unit_id" character varying`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "unit_org" integer`);
    const orgs = await queryRunner.manager.getRepository(Org).find();
    const unitRepo = queryRunner.manager.getRepository(Unit);
    for (const org of orgs) {
      const orgUnits = (await queryRunner.query(`SELECT DISTINCT "unit" FROM "roster" WHERE "org_id"=${org.id}`)).map((roster: { unit: string }) => roster.unit);

      for (const unitId of orgUnits) {
        const unit = new Unit();
        unit.id = sanitizeIndexPrefix(unitId);
        unit.name = unitId;
        unit.org = org;
        unit.musterConfiguration = [];
        await unitRepo.save(unit);

        await queryRunner.query(`UPDATE "roster" SET "unit_id"='${unit.id}' WHERE "unit"='${unit.name}' AND "org_id"=${org.id}`);
        await queryRunner.query(`UPDATE "roster" SET "unit_org"=${org.id} WHERE "unit"='${unit.name}' AND "org_id"=${org.id}`);
      }
    }

    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "unit_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "unit_org" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "unit"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "org_id"`);
    await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "FK_c6c0d1d31080b7f603d960238f1" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5" FOREIGN KEY ("unit_id", "unit_org") REFERENCES "unit"("id","org_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" ADD "unit" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "org_id" integer`);
    await queryRunner.query(`UPDATE "roster" SET "unit"="unit"."id" FROM "unit" WHERE "unit"."id"="roster"."unit_id"`);
    await queryRunner.query(`UPDATE "roster" SET "org_id"="unit"."org_id" FROM "unit" WHERE "unit"."id"="roster"."unit_id"`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "unit" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "org_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "FK_c6c0d1d31080b7f603d960238f1"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "unit_org"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "unit_id"`);
    await queryRunner.query(`DROP TABLE "unit"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

}
