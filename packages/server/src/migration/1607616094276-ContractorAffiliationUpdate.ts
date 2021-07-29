import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractorAffiliationUpdate1607616094276 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "user" SET "service"='Other' WHERE "service" = 'Contractor'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "user" SET "service"='Contractor' WHERE "service" = 'Other'`);
  }

}
