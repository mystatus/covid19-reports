import {MigrationInterface, QueryRunner} from "typeorm";

export class SeparateUnitFromRole1610729959726 implements MigrationInterface {
    name = 'SeparateUnitFromRole1610729959726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "index_prefix" TO "default_index_prefix"`);
        await queryRunner.query(`CREATE TABLE "user_role" ("id" SERIAL NOT NULL, "user_id" character varying(10) NOT NULL, "role_id" integer NOT NULL, "index_prefix" character varying NOT NULL DEFAULT '', "user_edipi" character varying(10), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_da99ac77b2109579404ede76460" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_da99ac77b2109579404ede76460"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "default_index_prefix" TO "index_prefix"`);
    }

}
