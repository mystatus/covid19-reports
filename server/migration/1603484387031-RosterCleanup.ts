import { MigrationInterface, QueryRunner } from 'typeorm';

export class RosterCleanup1603484387031 implements MigrationInterface {
  name = 'RosterCleanup1603484387031'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_roster_column" DROP CONSTRAINT "FK_fb53158e089b64e4c88c1e1ad18"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "billet_workcenter"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "contract_number"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "rate_rank"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "pilot"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "aircrew"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "cdi"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "cdqar"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "dscacrew"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "advanced_party"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "pui"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "covid19_test_return_date"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "rom"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "rom_release"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "start_date" TIMESTAMP DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "end_date" TIMESTAMP DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "custom_roster_column" ADD CONSTRAINT "FK_fb53158e089b64e4c88c1e1ad18" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_roster_column" DROP CONSTRAINT "FK_fb53158e089b64e4c88c1e1ad18"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "end_date"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "rom_release" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "rom" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "covid19_test_return_date" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "pui" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "advanced_party" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "dscacrew" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "cdqar" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "cdi" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "aircrew" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "pilot" boolean`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "rate_rank" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "contract_number" character varying(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "billet_workcenter" character varying(50) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "custom_roster_column" ADD CONSTRAINT "FK_fb53158e089b64e4c88c1e1ad18" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
