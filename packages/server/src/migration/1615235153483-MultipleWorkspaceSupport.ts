import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class MultipleWorkspaceSupport1615235153483 implements MigrationInterface {

  name = 'MultipleWorkspaceSupport1615235153483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_79824a434de2b4547a1be0c759a"`);
    await queryRunner.query(`CREATE TABLE "role_workspaces_workspace" ("role_id" integer NOT NULL, "workspace_id" integer NOT NULL, CONSTRAINT "PK_eb0ff2e932f029834b7b4423fc4" PRIMARY KEY ("role_id", "workspace_id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_3a66252c44d62e96cc06148af5" ON "role_workspaces_workspace" ("role_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_dabc79d61eea7d9ad222d1c726" ON "role_workspaces_workspace" ("workspace_id") `);

    // Add existing role workspaces to new join table.
    await queryRunner.query(`
      INSERT INTO role_workspaces_workspace
      SELECT id AS role_id, workspace_id
      FROM role
      WHERE workspace_id IS NOT NULL;
    `);

    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "workspace_id"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_3a66252c44d62e96cc06148af55" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" DROP CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b"`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" DROP CONSTRAINT "FK_3a66252c44d62e96cc06148af55"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "role" ADD "workspace_id" integer`);

    // Since there's no way to maintain multiple workspaces per role, just set the first workspace id that
    // comes back on the role. If no changes were made, this should revert to the exact state we came from.
    await queryRunner.query(`
      UPDATE role
      SET workspace_id = role_workspaces.workspace_id
      FROM (
        SELECT DISTINCT ON (role_id) role_id, workspace_id
        FROM role_workspaces_workspace 
      ) AS role_workspaces
      WHERE id = role_workspaces.role_id;
    `);

    await queryRunner.query(`DROP INDEX "IDX_dabc79d61eea7d9ad222d1c726"`);
    await queryRunner.query(`DROP INDEX "IDX_3a66252c44d62e96cc06148af5"`);
    await queryRunner.query(`DROP TABLE "role_workspaces_workspace"`);
    await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_79824a434de2b4547a1be0c759a" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

}
