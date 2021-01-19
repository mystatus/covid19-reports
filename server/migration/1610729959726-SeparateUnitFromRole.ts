import { MigrationInterface, QueryRunner } from "typeorm";

export class SeparateUnitFromRole1610729959726 implements MigrationInterface {
    name = 'SeparateUnitFromRole1610729959726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "index_prefix" TO "default_index_prefix"`);
        await queryRunner.query(`CREATE TABLE "user_role" ("id" SERIAL NOT NULL, "user_id" character varying(10) NOT NULL, "role_id" integer NOT NULL, "index_prefix" character varying NOT NULL DEFAULT '', "user_edipi" character varying(10), CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_da99ac77b2109579404ede76460" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);

        await queryRunner.query(`
            INSERT INTO user_role (user_id, role_id, index_prefix, user_edipi)
            SELECT ur.user as user_id, ur.role as role_id, r.default_index_prefix, ur.user as user_edipi
            FROM user_roles ur
            INNER JOIN role r on r.id = ur.role`
        );

        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_0475850442d60bd704c58041551"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_781a1c15149789c1609fe1b0258"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_roles" ("user" character varying(10) NOT NULL, "role" integer NOT NULL, CONSTRAINT "PK_949caf046fc278bd72bd4cbef84" PRIMARY KEY ("user", "role"))`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_781a1c15149789c1609fe1b0258" FOREIGN KEY ("user") REFERENCES "user"("edipi") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_0475850442d60bd704c58041551" FOREIGN KEY ("role") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);

        await queryRunner.query(`
            INSERT INTO user_roles
            SELECT ur.user_id as user, ur.role_id as role
            FROM user_role ur`
        );
        
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_32a6fc2fcb019d8e3a8ace0f55f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_da99ac77b2109579404ede76460"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME COLUMN "default_index_prefix" TO "index_prefix"`);
    }

}
