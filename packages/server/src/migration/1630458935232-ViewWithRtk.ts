import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class ViewWithRtk1630458935232 implements MigrationInterface {

  name = 'ViewWithRtk1630458935232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update entity_type values.
    await queryRunner.query(`ALTER TABLE "public"."saved_filter" ALTER COLUMN "entity_type" TYPE varchar`);
    await queryRunner.query(`UPDATE "public"."saved_filter" SET "entity_type" = 'observation' WHERE "entity_type" = 'Observation'`);
    await queryRunner.query(`UPDATE "public"."saved_filter" SET "entity_type" = 'roster' WHERE "entity_type" = 'RosterEntry'`);

    await queryRunner.query(`ALTER TABLE "public"."saved_layout" ALTER COLUMN "entity_type" TYPE varchar`);
    await queryRunner.query(`UPDATE "public"."saved_layout" SET "entity_type" = 'observation' WHERE "entity_type" = 'Observation'`);
    await queryRunner.query(`UPDATE "public"."saved_layout" SET "entity_type" = 'roster' WHERE "entity_type" = 'RosterEntry'`);

    await queryRunner.query(`DROP INDEX "public"."IDX_fc48f2ae15c4a571fd5710b2f1"`);
    await queryRunner.query(`ALTER TYPE "public"."saved_filter_entity_type_enum" RENAME TO "saved_filter_entity_type_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."saved_filter_entity_type_enum" AS ENUM('observation', 'roster')`);
    await queryRunner.query(`ALTER TABLE "public"."saved_filter" ALTER COLUMN "entity_type" TYPE "public"."saved_filter_entity_type_enum" USING "entity_type"::"text"::"public"."saved_filter_entity_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."saved_filter_entity_type_enum_old"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f0881074badda56d5172d34e59"`);
    await queryRunner.query(`ALTER TYPE "public"."saved_layout_entity_type_enum" RENAME TO "saved_layout_entity_type_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."saved_layout_entity_type_enum" AS ENUM('observation', 'roster')`);
    await queryRunner.query(`ALTER TABLE "public"."saved_layout" ALTER COLUMN "entity_type" TYPE "public"."saved_layout_entity_type_enum" USING "entity_type"::"text"::"public"."saved_layout_entity_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."saved_layout_entity_type_enum_old"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc48f2ae15c4a571fd5710b2f1" ON "public"."saved_filter" ("org_id", "name", "entity_type") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f0881074badda56d5172d34e59" ON "public"."saved_layout" ("org_id", "name", "entity_type") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Update entity_type values.
    await queryRunner.query(`ALTER TABLE "public"."saved_filter" ALTER COLUMN "entity_type" TYPE varchar`);
    await queryRunner.query(`UPDATE "public"."saved_filter" SET "entity_type" = 'Observation' WHERE "entity_type" = 'observation'`);
    await queryRunner.query(`UPDATE "public"."saved_filter" SET "entity_type" = 'RosterEntry' WHERE "entity_type" = 'roster'`);

    await queryRunner.query(`ALTER TABLE "public"."saved_layout" ALTER COLUMN "entity_type" TYPE varchar`);
    await queryRunner.query(`UPDATE "public"."saved_layout" SET "entity_type" = 'Observation' WHERE "entity_type" = 'observation'`);
    await queryRunner.query(`UPDATE "public"."saved_layout" SET "entity_type" = 'RosterEntry' WHERE "entity_type" = 'roster'`);

    await queryRunner.query(`DROP INDEX "public"."IDX_f0881074badda56d5172d34e59"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fc48f2ae15c4a571fd5710b2f1"`);
    await queryRunner.query(`CREATE TYPE "public"."saved_layout_entity_type_enum_old" AS ENUM('Observation', 'RosterEntry')`);
    await queryRunner.query(`ALTER TABLE "public"."saved_layout" ALTER COLUMN "entity_type" TYPE "public"."saved_layout_entity_type_enum_old" USING "entity_type"::"text"::"public"."saved_layout_entity_type_enum_old"`);
    await queryRunner.query(`DROP TYPE "public"."saved_layout_entity_type_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."saved_layout_entity_type_enum_old" RENAME TO "saved_layout_entity_type_enum"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f0881074badda56d5172d34e59" ON "public"."saved_layout" ("name", "entity_type", "org_id") `);
    await queryRunner.query(`CREATE TYPE "public"."saved_filter_entity_type_enum_old" AS ENUM('Observation', 'RosterEntry')`);
    await queryRunner.query(`ALTER TABLE "public"."saved_filter" ALTER COLUMN "entity_type" TYPE "public"."saved_filter_entity_type_enum_old" USING "entity_type"::"text"::"public"."saved_filter_entity_type_enum_old"`);
    await queryRunner.query(`DROP TYPE "public"."saved_filter_entity_type_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."saved_filter_entity_type_enum_old" RENAME TO "saved_filter_entity_type_enum"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc48f2ae15c4a571fd5710b2f1" ON "public"."saved_filter" ("name", "entity_type", "org_id") `);
  }

}
