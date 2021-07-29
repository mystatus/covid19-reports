import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class NewAccessRequestFlow1617052908638 implements MigrationInterface {

  name = 'NewAccessRequestFlow1617052908638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "access_request" ADD "what_you_do" character varying array NOT NULL DEFAULT '{"n/a"}'`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "sponsor_name" character varying NOT NULL DEFAULT 'n/a'`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "sponsor_email" character varying NOT NULL DEFAULT 'n/a'`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "sponsor_phone" character varying NOT NULL DEFAULT '000-000-0000'`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "justification" character varying NOT NULL DEFAULT 'n/a'`);

    await queryRunner.query(`ALTER TABLE "access_request" ALTER COLUMN "what_you_do" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "access_request" ALTER COLUMN "sponsor_name" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "access_request" ALTER COLUMN "sponsor_email" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "access_request" ALTER COLUMN "sponsor_phone" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "access_request" ALTER COLUMN "justification" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "justification"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "sponsor_phone"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "sponsor_email"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "sponsor_name"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "what_you_do"`);
  }

}
