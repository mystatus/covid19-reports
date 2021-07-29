import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhNumberToRoster1626272858319 implements MigrationInterface {

  name = 'AddPhNumberToRoster1626272858319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster_history" ADD "phone_number" character varying(20) NOT NULL DEFAULT 'Missing'`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "phone_number" character varying(20) NOT NULL DEFAULT 'Missing'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "phone_number"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP COLUMN "phone_number"`);
  }

}
