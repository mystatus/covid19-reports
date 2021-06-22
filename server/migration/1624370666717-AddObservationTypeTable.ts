import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservationTypeTable1624370666717 implements MigrationInterface {
  name = 'AddObservationTypeTable1624370666717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "observation_type" ("type" character varying(100) NOT NULL, CONSTRAINT "UQ_45daf0e906ab42b60abeaf83bd5" UNIQUE ("type"), CONSTRAINT "PK_45daf0e906ab42b60abeaf83bd5" PRIMARY KEY ("type"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "observation_type"`);
  }

}
