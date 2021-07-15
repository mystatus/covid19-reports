import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrphanedRecordAlertCreatedOn1617298610206 implements MigrationInterface {
  name = 'OrphanedRecordAlertCreatedOn1617298610206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orphaned_record" ADD "created_on" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orphaned_record" DROP COLUMN "created_on"`);
  }

}
