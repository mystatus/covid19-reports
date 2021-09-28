import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFilterIdToLayout1632834035968 implements MigrationInterface {
    name = 'AddFilterIdToLayout1632834035968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_layout" DROP CONSTRAINT "FK_9d4afa84a20cd6863231215ebce"`);
        await queryRunner.query(`ALTER TABLE "saved_layout" ALTER COLUMN "saved_filter_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_layout" ADD CONSTRAINT "FK_9d4afa84a20cd6863231215ebce" FOREIGN KEY ("saved_filter_id") REFERENCES "saved_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_layout" DROP CONSTRAINT "FK_9d4afa84a20cd6863231215ebce"`);
        await queryRunner.query(`ALTER TABLE "saved_layout" ALTER COLUMN "saved_filter_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_layout" ADD CONSTRAINT "FK_9d4afa84a20cd6863231215ebce" FOREIGN KEY ("saved_filter_id") REFERENCES "saved_filter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
