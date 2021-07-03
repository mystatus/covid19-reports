import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultMusterConfiguration1611336465930 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "org" ADD "default_muster_configuration" json NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" SET DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "unit" SET "muster_configuration" = '[]' WHERE "muster_configuration" IS NULL`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" SET DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "unit" ALTER COLUMN "muster_configuration" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "org" DROP COLUMN "default_muster_configuration"`);
  }

}
