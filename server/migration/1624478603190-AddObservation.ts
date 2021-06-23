import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservation1624478603190 implements MigrationInterface {
  name = 'AddObservation1624478603190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "observation_type" ("type" character varying(100) NOT NULL, CONSTRAINT "UQ_45daf0e906ab42b60abeaf83bd5" UNIQUE ("type"), CONSTRAINT "PK_45daf0e906ab42b60abeaf83bd5" PRIMARY KEY ("type"))`);
    await queryRunner.query(`CREATE TABLE "observation" ("id" SERIAL NOT NULL, "document_id" character varying(100) NOT NULL, "edipi" character varying(10) NOT NULL, "timestamp" TIMESTAMP NOT NULL, "type" character varying(50) NOT NULL, "unit_id" character varying(50) NOT NULL, "unit" character varying(100) NOT NULL, "org_id" character varying(50) NOT NULL, CONSTRAINT "UQ_c3b96ba3699ceaa1c9c95bdab10" UNIQUE ("id", "document_id"), CONSTRAINT "PK_77a736edc631a400b788ce302cb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_ea8a73e50440da7b4e5d5893d8b" FOREIGN KEY ("type") REFERENCES "observation_type"("type") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_ea8a73e50440da7b4e5d5893d8b"`);
    await queryRunner.query(`DROP TABLE "observation"`);
    await queryRunner.query(`DROP TABLE "observation_type"`);
  }

}
