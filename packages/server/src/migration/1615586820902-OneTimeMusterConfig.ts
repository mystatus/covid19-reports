import { MigrationInterface, QueryRunner } from 'typeorm';

export class OneTimeMusterConfig1615586820902 implements MigrationInterface {

  name = 'OneTimeMusterConfig1615586820902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit" ADD "include_default_config" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`UPDATE "unit" SET "include_default_config" = false WHERE "muster_configuration" IS NOT NULL`);
    await queryRunner.query(`UPDATE "unit" SET "muster_configuration" = '[]' WHERE "muster_configuration" IS NULL`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" SET DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" DROP NOT NULL`);
    await queryRunner.query(`UPDATE "unit" SET "muster_configuration" = null WHERE json_array_length("muster_configuration") = 0 AND "include_default_config" = true`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "include_default_config"`);
  }

}
