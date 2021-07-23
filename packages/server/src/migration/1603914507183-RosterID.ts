import { MigrationInterface, QueryRunner } from 'typeorm';

export class RosterID1603914507183 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "PK_6d3bc54502350051de7e30cfb91"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "PK_d836805ef5a6b6dd4076813121e" PRIMARY KEY ("edipi", "org_id", "id")`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "PK_d836805ef5a6b6dd4076813121e"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "PK_408c554bc2c3d9571a859fd0f46" PRIMARY KEY ("org_id", "id")`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "PK_408c554bc2c3d9571a859fd0f46"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "PK_a4942154015f2666f3b5ddc15d3" PRIMARY KEY ("id")`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "PK_a4942154015f2666f3b5ddc15d3"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "PK_408c554bc2c3d9571a859fd0f46" PRIMARY KEY ("org_id", "id")`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "PK_408c554bc2c3d9571a859fd0f46"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "PK_d836805ef5a6b6dd4076813121e" PRIMARY KEY ("edipi", "org_id", "id")`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "PK_d836805ef5a6b6dd4076813121e"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "PK_6d3bc54502350051de7e30cfb91" PRIMARY KEY ("edipi", "org_id")`);
    await queryRunner.query(`ALTER TABLE "roster" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_933f7dbcd30d5bc6eb9e2048510" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
