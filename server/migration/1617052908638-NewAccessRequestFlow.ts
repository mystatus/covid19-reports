import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class NewAccessRequestFlow1617052908638 implements MigrationInterface {
  name = 'NewAccessRequestFlow1617052908638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "access_request" ADD "what_you_do" character varying array NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "sponsor_name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "sponsor_email" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "sponsor_phone" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD "justification" character varying NOT NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user_notification_setting"."last_notified_date" IS NULL`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" DROP DEFAULT`);
    await queryRunner.query(`COMMENT ON COLUMN "user_notification_setting"."last_notified_date" IS NULL`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "justification"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "sponsor_phone"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "sponsor_email"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "sponsor_name"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP COLUMN "what_you_do"`);
  }

}
