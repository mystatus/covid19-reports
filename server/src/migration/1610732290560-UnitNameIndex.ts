import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class UnitNameIndex1610732290560 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_232f43836beace9d8657a8a4c8" ON "unit" ("org_id", "name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_232f43836beace9d8657a8a4c8"`);
  }

}
