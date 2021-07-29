import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class TypeormUpdate1625689852506 implements MigrationInterface {

  name = 'TypeormUpdate1625689852506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" DROP CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b"`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" DROP CONSTRAINT "FK_3a66252c44d62e96cc06148af55"`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" DROP CONSTRAINT "FK_b44564e0f78b5335fd9d6939f55"`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" DROP CONSTRAINT "FK_97020bc8ce123b5a4a27e739629"`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_3a66252c44d62e96cc06148af55" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" ADD CONSTRAINT "FK_97020bc8ce123b5a4a27e739629" FOREIGN KEY ("user_role") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" ADD CONSTRAINT "FK_b44564e0f78b5335fd9d6939f55" FOREIGN KEY ("unit") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role_unit" DROP CONSTRAINT "FK_b44564e0f78b5335fd9d6939f55"`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" DROP CONSTRAINT "FK_97020bc8ce123b5a4a27e739629"`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" DROP CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b"`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" DROP CONSTRAINT "FK_3a66252c44d62e96cc06148af55"`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" ADD CONSTRAINT "FK_97020bc8ce123b5a4a27e739629" FOREIGN KEY ("user_role") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_role_unit" ADD CONSTRAINT "FK_b44564e0f78b5335fd9d6939f55" FOREIGN KEY ("unit") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_3a66252c44d62e96cc06148af55" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role_workspaces_workspace" ADD CONSTRAINT "FK_dabc79d61eea7d9ad222d1c726b" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

}
