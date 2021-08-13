import { MigrationInterface, QueryRunner } from 'typeorm';

export class Observations1628778772586 implements MigrationInterface {

  name = 'Observations1628778772586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" ADD "custom_columns" json NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "role" ADD "can_view_observation" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "can_view_observation"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "custom_columns"`);
  }

}
