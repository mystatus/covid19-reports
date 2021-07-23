import { MigrationInterface, QueryRunner } from 'typeorm';

export class UnitIDSequence1614813401758 implements MigrationInterface {
  name = 'UnitIDSequence1614813401758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster_history" DROP CONSTRAINT "FK_34e597fefbd4b9d5600513023fd"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa"`);
    await queryRunner.query(`ALTER SEQUENCE IF EXISTS unit_new_id_seq RENAME TO unit_id_seq`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_b475b22c00b1274d9642a2f6357" UNIQUE ("edipi", "unit_id")`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_bb205dd6ec21f745f77cfbf1e0d" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_c310d06c8825513f5f35009d6c7" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "FK_c310d06c8825513f5f35009d6c7"`);
    await queryRunner.query(`ALTER TABLE "roster_history" DROP CONSTRAINT "FK_bb205dd6ec21f745f77cfbf1e0d"`);
    await queryRunner.query(`ALTER TABLE "roster" DROP CONSTRAINT "UQ_b475b22c00b1274d9642a2f6357"`);
    await queryRunner.query(`ALTER SEQUENCE IF EXISTS unit_id_seq RENAME TO unit_new_id_seq`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "UQ_ce01434bd61ca4cdb9527b8f1fa" UNIQUE ("edipi", "unit_id")`);
    await queryRunner.query(`ALTER TABLE "roster" ADD CONSTRAINT "FK_b12544f980cb8f403bc514a2ab5" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "roster_history" ADD CONSTRAINT "FK_34e597fefbd4b9d5600513023fd" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

}
