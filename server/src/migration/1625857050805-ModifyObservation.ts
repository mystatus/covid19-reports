import {MigrationInterface, QueryRunner} from 'typeorm';

export class ModifyObservation1625857050805 implements MigrationInterface {
  name = 'ModifyObservation1625857050805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" RENAME COLUMN "unit_id" TO "reporting_group"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "reporting_group"`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "reporting_group" character varying(100)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "reporting_group"`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "reporting_group" character varying(300) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "observation" RENAME COLUMN "reporting_group" TO "unit_id"`);
  }

}
