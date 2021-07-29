import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDefaultUnitFilter1612565888167 implements MigrationInterface {

  name = 'RemoveDefaultUnitFilter1612565888167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "default_index_prefix"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" ADD "default_index_prefix" character varying NOT NULL DEFAULT ''`);
  }

}
