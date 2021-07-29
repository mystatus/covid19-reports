import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservation1625182948142 implements MigrationInterface {

  name = 'AddObservation1625182948142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "observation" ("id" SERIAL NOT NULL, "document_id" character varying(100) NOT NULL, "edipi" character varying(10) NOT NULL, "timestamp" TIMESTAMP NOT NULL, "unit_id" character varying(300) NOT NULL, "unit" character varying(300) NOT NULL, "type_id" character varying, "type_org" integer, CONSTRAINT "UQ_c3b96ba3699ceaa1c9c95bdab10" UNIQUE ("id", "document_id"), CONSTRAINT "PK_77a736edc631a400b788ce302cb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_0b57dfaba116dbb62e22b966ed4" FOREIGN KEY ("type_id", "type_org") REFERENCES "report_schema"("id","org_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_0b57dfaba116dbb62e22b966ed4"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" DROP DEFAULT`);
    await queryRunner.query(`DROP TABLE "observation"`);
  }

}
