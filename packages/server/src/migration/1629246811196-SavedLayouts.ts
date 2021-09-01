import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class SavedLayouts1629246811196 implements MigrationInterface {

  name = 'SavedLayouts1629246811196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_09f621953b1dd82f93dee5672b"`);
    await queryRunner.query(`CREATE TYPE "saved_layout_entity_type_enum" AS ENUM('Observation', 'RosterEntry')`);
    await queryRunner.query(`CREATE TABLE "saved_layout" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "entity_type" "saved_layout_entity_type_enum" NOT NULL, "columns" json NOT NULL DEFAULT '{}', "actions" json NOT NULL DEFAULT '{}', "org_id" integer NOT NULL, CONSTRAINT "PK_e7e93a79d9f5574c0c745ea59aa" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f0881074badda56d5172d34e59" ON "saved_layout" ("org_id", "name", "entity_type") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc48f2ae15c4a571fd5710b2f1" ON "saved_filter" ("org_id", "name", "entity_type") `);
    await queryRunner.query(`ALTER TABLE "saved_layout" ADD CONSTRAINT "FK_f2d4ff3cea0cc2c6de8721d77ba" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_layout" DROP CONSTRAINT "FK_f2d4ff3cea0cc2c6de8721d77ba"`);
    await queryRunner.query(`DROP INDEX "IDX_fc48f2ae15c4a571fd5710b2f1"`);
    await queryRunner.query(`DROP INDEX "IDX_f0881074badda56d5172d34e59"`);
    await queryRunner.query(`DROP TABLE "saved_layout"`);
    await queryRunner.query(`DROP TYPE "saved_layout_entity_type_enum"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_09f621953b1dd82f93dee5672b" ON "saved_filter" ("name", "org_id") `);
  }

}
