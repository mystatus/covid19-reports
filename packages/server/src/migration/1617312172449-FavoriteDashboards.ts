import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class FavoriteDashboards1617312172449 implements MigrationInterface {

  name = 'FavoriteDashboards1617312172449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role" ADD "favorite_dashboards" json NOT NULL DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_role" DROP COLUMN "favorite_dashboards"`);
  }

}
