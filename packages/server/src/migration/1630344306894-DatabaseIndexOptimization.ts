import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseIndexOptimization1630344306894 implements MigrationInterface {

  name = 'DatabaseIndexOptimization1630344306894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null`);
    await queryRunner.query(`CREATE INDEX "org-name" ON "org" ("name") `);
    await queryRunner.query(`CREATE INDEX "org-indexPrefix" ON "org" ("index_prefix") `);
    await queryRunner.query(`CREATE INDEX "org-reportingGroup" ON "org" ("reporting_group") `);
    await queryRunner.query(`CREATE INDEX "access-request-sponsorName" ON "access_request" ("sponsor_name") `);
    await queryRunner.query(`CREATE INDEX "IDX_bf2c525c1954184fff29d7435d" ON "roster_history" ("edipi") `);
    await queryRunner.query(`CREATE INDEX "roster-history-timestamp" ON "roster_history" ("timestamp") `);
    await queryRunner.query(`CREATE INDEX "roster-history-change-type" ON "roster_history" ("change_type") `);
    await queryRunner.query(`CREATE INDEX "IDX_1dfed9a1a96c14996e25d5f2f7" ON "roster" ("edipi") `);
    await queryRunner.query(`CREATE INDEX "orphaned-record-compositeId" ON "orphaned_record" ("composite_id") `);
    await queryRunner.query(`CREATE INDEX "observation-edipi" ON "observation" ("edipi") `);
    await queryRunner.query(`CREATE INDEX "observation-timestamp" ON "observation" ("timestamp") `);
    await queryRunner.query(`CREATE INDEX "observation-unit" ON "observation" ("unit") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "observation-unit"`);
    await queryRunner.query(`DROP INDEX "observation-timestamp"`);
    await queryRunner.query(`DROP INDEX "observation-edipi"`);
    await queryRunner.query(`DROP INDEX "orphaned-record-compositeId"`);
    await queryRunner.query(`DROP INDEX "IDX_1dfed9a1a96c14996e25d5f2f7"`);
    await queryRunner.query(`DROP INDEX "roster-history-change-type"`);
    await queryRunner.query(`DROP INDEX "roster-history-timestamp"`);
    await queryRunner.query(`DROP INDEX "IDX_bf2c525c1954184fff29d7435d"`);
    await queryRunner.query(`DROP INDEX "access-request-sponsorName"`);
    await queryRunner.query(`DROP INDEX "org-reportingGroup"`);
    await queryRunner.query(`DROP INDEX "org-indexPrefix"`);
    await queryRunner.query(`DROP INDEX "org-name"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" DROP DEFAULT`);
  }

}
