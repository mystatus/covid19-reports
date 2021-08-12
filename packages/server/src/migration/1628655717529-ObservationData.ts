import {MigrationInterface, QueryRunner} from "typeorm";

export class ObservationData1628655717529 implements MigrationInterface {
    name = 'ObservationData1628655717529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "observation" ADD "custom_columns" json NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "custom_columns"`);
    }

}
