import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrphanedRecords1615837014202 implements MigrationInterface {

  name = 'OrphanedRecords1615837014202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "orphaned_record" ("document_id" character varying NOT NULL, "composite_id" character varying NOT NULL, "edipi" character varying(10) NOT NULL, "unit" character varying NOT NULL, "phone" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "deleted_on" TIMESTAMP, "org_id" integer, CONSTRAINT "PK_a41e13571c91cc4960e6d7d21f9" PRIMARY KEY ("document_id"))`);
    await queryRunner.query(`CREATE TYPE "orphaned_record_action_type_enum" AS ENUM('claim', 'ignore')`);
    await queryRunner.query(`CREATE TABLE "orphaned_record_action" ("id" character varying NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "expires_on" TIMESTAMP, "type" "orphaned_record_action_type_enum" NOT NULL DEFAULT 'ignore', "user_edipi" character varying(10) NOT NULL, CONSTRAINT "PK_91e12ce795c8b2eeaecda2bab61" PRIMARY KEY ("id", "user_edipi"))`);
    await queryRunner.query(`ALTER TABLE "orphaned_record" ADD CONSTRAINT "FK_636e28a41350657472f90905e37" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "orphaned_record_action" ADD CONSTRAINT "FK_9655cd38fc2d31137da88d56c9b" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orphaned_record_action" DROP CONSTRAINT "FK_9655cd38fc2d31137da88d56c9b"`);
    await queryRunner.query(`ALTER TABLE "orphaned_record" DROP CONSTRAINT "FK_636e28a41350657472f90905e37"`);
    await queryRunner.query(`DROP TABLE "orphaned_record_action"`);
    await queryRunner.query(`DROP TYPE "orphaned_record_action_type_enum"`);
    await queryRunner.query(`DROP TABLE "orphaned_record"`);
  }

}
