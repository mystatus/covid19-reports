import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservationTable1624389812587 implements MigrationInterface {
  name = 'AddObservationTable1624389812587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "observation" ("id" SERIAL NOT NULL, "document_id" character varying(100) NOT NULL, "edipi" character varying(10) NOT NULL, "timestamp" character varying(50) NOT NULL, "type" character varying(50) NOT NULL, "unit_id" character varying(50) NOT NULL, "unit" character varying(100) NOT NULL, "org_id" character varying(50) NOT NULL, CONSTRAINT "UQ_c3b96ba3699ceaa1c9c95bdab10" UNIQUE ("id", "document_id"), CONSTRAINT "PK_77a736edc631a400b788ce302cb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_ea8a73e50440da7b4e5d5893d8b" FOREIGN KEY ("type") REFERENCES "observation_type"("type") ON DELETE RESTRICT ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_ea8a73e50440da7b4e5d5893d8b"`);
    await queryRunner.query(`DROP TABLE "observation"`);
  }

}
