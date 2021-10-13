import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class RemoveSpaces1634156273708 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "can_manage_workspace"`);
    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "favorite_dashboards"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "dashboard_uuid"`);
    await queryRunner.query(`DROP TABLE "role_workspaces_workspace"`);
    await queryRunner.query(`DROP TABLE "workspace"`);
    await queryRunner.query(`DROP TABLE "workspace_template"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "workspace_template" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "pii" boolean NOT NULL, "phi" boolean NOT NULL, "kibana_saved_objects" text NOT NULL, CONSTRAINT "PK_cffbc7d1606ac418b10ce9bab12" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "workspace" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "pii" boolean NOT NULL, "phi" boolean NOT NULL, "org_id" integer NOT NULL, "workspace_template_id" integer, CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "role_workspaces_workspace" ("role_id" integer NOT NULL, "workspace_id" integer NOT NULL, CONSTRAINT "PK_eb0ff2e932f029834b7b4423fc4" PRIMARY KEY ("role_id", "workspace_id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_3a66252c44d62e96cc06148af5" ON "role_workspaces_workspace" ("role_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_dabc79d61eea7d9ad222d1c726" ON "role_workspaces_workspace" ("workspace_id") `);
    await queryRunner.query(`ALTER TABLE "role" ADD "can_manage_workspace" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user_role" ADD "favorite_dashboards" json NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "dashboard_uuid" character varying`);
    await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_a5498b79ec16741b57e976105ee" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_a55d0d92d3dbbff75445a7cb824" FOREIGN KEY ("workspace_template_id") REFERENCES "workspace_template"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_3a66252c44d62e96cc06148af55" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
