import {MigrationInterface, QueryRunner} from "typeorm";

export class PinnedLayouts1630519684578 implements MigrationInterface {
    name = 'PinnedLayouts1630519684578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null`);
        await queryRunner.query(`ALTER TYPE "saved_layout_pin_target_enum" RENAME TO "saved_layout_pin_target_enum_old"`);
        await queryRunner.query(`CREATE TYPE "saved_layout_pin_target_enum" AS ENUM('None', 'Sidebar', 'Home')`);
        await queryRunner.query(`ALTER TABLE "saved_layout" ALTER COLUMN "pin_target" TYPE "saved_layout_pin_target_enum" USING "pin_target"::"text"::"saved_layout_pin_target_enum"`);
        await queryRunner.query(`DROP TYPE "saved_layout_pin_target_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "saved_layout_pin_target_enum_old" AS ENUM('Sidebar', 'Home')`);
        await queryRunner.query(`ALTER TABLE "saved_layout" ALTER COLUMN "pin_target" TYPE "saved_layout_pin_target_enum_old" USING "pin_target"::"text"::"saved_layout_pin_target_enum_old"`);
        await queryRunner.query(`DROP TYPE "saved_layout_pin_target_enum"`);
        await queryRunner.query(`ALTER TYPE "saved_layout_pin_target_enum_old" RENAME TO "saved_layout_pin_target_enum"`);
        // await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" DROP DEFAULT`);
    }

}
