import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class ModelCascadeFixes1612918296777 implements MigrationInterface {

  name = 'ModelCascadeFixes1612918296777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_a5498b79ec16741b57e976105ee"`);
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_da99ac77b2109579404ede76460"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP CONSTRAINT "FK_309a26a4130d531a5c0c80e915f"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179"`);
    await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_a5498b79ec16741b57e976105ee" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_da99ac77b2109579404ede76460" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD CONSTRAINT "FK_309a26a4130d531a5c0c80e915f" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "access_request" DROP CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179"`);
    await queryRunner.query(`ALTER TABLE "access_request" DROP CONSTRAINT "FK_309a26a4130d531a5c0c80e915f"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c"`);
    await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_da99ac77b2109579404ede76460"`);
    await queryRunner.query(`ALTER TABLE "workspace" DROP CONSTRAINT "FK_a5498b79ec16741b57e976105ee"`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD CONSTRAINT "FK_f7b4d940ab0c531be455c5f9179" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "access_request" ADD CONSTRAINT "FK_309a26a4130d531a5c0c80e915f" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_1e101d094ff40fa4ed179ac014c" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_da99ac77b2109579404ede76460" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "workspace" ADD CONSTRAINT "FK_a5498b79ec16741b57e976105ee" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
