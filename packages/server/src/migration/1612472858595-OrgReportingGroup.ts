import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgReportingGroup1612472858595 implements MigrationInterface {

  name = 'OrgReportingGroup1612472858595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_da99ac77b2109579404ede76460"`);
    await queryRunner.query(`ALTER TABLE "org" ADD "reporting_group" character varying`);
    await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_da99ac77b2109579404ede76460" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_da99ac77b2109579404ede76460"`);
    await queryRunner.query(`ALTER TABLE "org" DROP COLUMN "reporting_group"`);
    await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_da99ac77b2109579404ede76460" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
