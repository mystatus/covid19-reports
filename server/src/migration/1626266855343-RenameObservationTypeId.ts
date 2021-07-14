import {MigrationInterface, QueryRunner} from 'typeorm';

export class RenameObservationTypeId1626266855343 implements MigrationInterface {
  name = 'RenameObservationTypeId1626266855343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_0b57dfaba116dbb62e22b966ed4"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "type_id"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "type_org"`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "report_schema_id" character varying`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "report_schema_org" integer`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_06b516c2511a0818e22766a4a12" FOREIGN KEY ("report_schema_id", "report_schema_org") REFERENCES "report_schema"("id","org_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_06b516c2511a0818e22766a4a12"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "report_schema_org"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "report_schema_id"`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "type_org" integer`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "type_id" character varying`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_0b57dfaba116dbb62e22b966ed4" FOREIGN KEY ("type_org", "type_id") REFERENCES "report_schema"("org_id","id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

}
