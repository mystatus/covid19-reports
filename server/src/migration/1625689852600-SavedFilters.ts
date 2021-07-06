import { MigrationInterface, QueryRunner } from 'typeorm';

export class SavedFilters1624334170614 implements MigrationInterface {
  name = 'SavedFilters1624334170614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "saved_filter_entity_type_enum" AS ENUM('Observation', 'RosterEntry')`);
    await queryRunner.query(`CREATE TABLE "saved_filter" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "entity_type" "saved_filter_entity_type_enum" NOT NULL, "filter_configuration" json NOT NULL DEFAULT '{}', "org_id" integer NOT NULL, CONSTRAINT "PK_efff8142c6db3d6ed6f47bc2719" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_09f621953b1dd82f93dee5672b" ON "saved_filter" ("org_id", "name") `);
    await queryRunner.query(`ALTER TABLE "saved_filter" ADD CONSTRAINT "FK_3d645dcbc4244b1ac57076db60c" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_filter" DROP CONSTRAINT "FK_3d645dcbc4244b1ac57076db60c"`);
    await queryRunner.query(`DROP INDEX "IDX_09f621953b1dd82f93dee5672b"`);
    await queryRunner.query(`DROP TABLE "saved_filter"`);
    await queryRunner.query(`DROP TYPE "saved_filter_entity_type_enum"`);
  }

}
