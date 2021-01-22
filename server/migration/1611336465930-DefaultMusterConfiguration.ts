import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultMusterConfiguration1611336465930 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "org" ADD "default_muster_configuration" json NOT NULL DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "org" DROP COLUMN "default_muster_configuration"`);
  }

}
