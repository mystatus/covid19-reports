import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrphanedRecords1614019803703 implements MigrationInterface {
  name = 'OrphanedRecords1614019803703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "orphaned_record" ("edipi" character varying(10) NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "report" json NOT NULL DEFAULT '{}', "org_id" integer, CONSTRAINT "PK_45de4610bec700be319c312e849" PRIMARY KEY ("edipi", "created_on"))`);
    await queryRunner.query(`CREATE TYPE "orphaned_record_action_type_enum" AS ENUM('claim', 'ignore')`);
    await queryRunner.query(`CREATE TABLE "orphaned_record_action" ("edipi" character varying(10) NOT NULL, "created_on" TIMESTAMP NOT NULL DEFAULT now(), "expires_on" TIMESTAMP NOT NULL, "type" "orphaned_record_action_type_enum" NOT NULL DEFAULT 'ignore', "user_edipi" character varying(10) NOT NULL, "org_id" integer, CONSTRAINT "PK_0ebffe2b27b8b363c43316b97c2" PRIMARY KEY ("edipi", "user_edipi"))`);
    await queryRunner.query(`ALTER TABLE "orphaned_record" ADD CONSTRAINT "FK_636e28a41350657472f90905e37" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "orphaned_record_action" ADD CONSTRAINT "FK_9655cd38fc2d31137da88d56c9b" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "orphaned_record_action" ADD CONSTRAINT "FK_9ca6889c48179fa924fceb9bbac" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orphaned_record_action" DROP CONSTRAINT "FK_9ca6889c48179fa924fceb9bbac"`);
    await queryRunner.query(`ALTER TABLE "orphaned_record_action" DROP CONSTRAINT "FK_9655cd38fc2d31137da88d56c9b"`);
    await queryRunner.query(`ALTER TABLE "orphaned_record" DROP CONSTRAINT "FK_636e28a41350657472f90905e37"`);
    await queryRunner.query(`DROP TABLE "orphaned_record_action"`);
    await queryRunner.query(`DROP TYPE "orphaned_record_action_type_enum"`);
    await queryRunner.query(`DROP TABLE "orphaned_record"`);
  }

}
