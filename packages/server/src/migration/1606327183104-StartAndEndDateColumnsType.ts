import { MigrationInterface, QueryRunner } from 'typeorm';

export class StartAndEndDateColumnsType1606327183104 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" ADD "start_date_value" DATE DEFAULT null`);
    await queryRunner.query(`UPDATE "roster" SET "start_date_value" = DATE(start_date)`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN start_date TYPE DATE USING start_date_value`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "start_date_value"`);

    await queryRunner.query(`ALTER TABLE "roster" ADD "end_date_value" DATE DEFAULT null`);
    await queryRunner.query(`UPDATE "roster" SET "end_date_value" = DATE(end_date)`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN end_date TYPE DATE USING end_date_value`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "end_date_value"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" ADD "start_date_value" timestamp without time zone DEFAULT null`);
    await queryRunner.query(`UPDATE "roster" SET "start_date_value" = start_date::TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN start_date TYPE timestamp without time zone USING start_date_value`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "start_date_value"`);

    await queryRunner.query(`ALTER TABLE "roster" ADD "end_date_value" timestamp without time zone DEFAULT null`);
    await queryRunner.query(`UPDATE "roster" SET "end_date_value" = end_date::TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN end_date TYPE timestamp without time zone USING end_date_value`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "end_date_value"`);
  }

}
