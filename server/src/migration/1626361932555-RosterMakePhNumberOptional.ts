import {MigrationInterface, QueryRunner} from 'typeorm';

export class RosterMakePhNumberOptional1626361932555 implements MigrationInterface {
  name = 'RosterMakePhNumberOptional1626361932555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster_history" ALTER COLUMN "phone_number" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster_history" ALTER COLUMN "phone_number" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "phone_number" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "phone_number" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "phone_number" SET DEFAULT 'Missing'`);
    await queryRunner.query(`ALTER TABLE "roster" ALTER COLUMN "phone_number" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster_history" ALTER COLUMN "phone_number" SET DEFAULT 'Missing'`);
    await queryRunner.query(`ALTER TABLE "roster_history" ALTER COLUMN "phone_number" SET NOT NULL`);
  }

}
