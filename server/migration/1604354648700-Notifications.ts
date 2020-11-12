import { MigrationInterface, QueryRunner } from 'typeorm';
import { Notification } from '../api/notification/notification.model';
import { defaultNotifications } from '../api/notification/default-notifications';

export class Notifications1604354648700 implements MigrationInterface {
  name = 'Notifications1604354648700'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "notification" ("id" character varying NOT NULL, "ui_sort" double precision NOT NULL, "ui_name" character varying NOT NULL, "ui_description" character varying NOT NULL, "ui_settings_template" character varying NOT NULL, "sms_template" character varying NOT NULL, "email_text_template" character varying NOT NULL, "email_html_template" character varying NOT NULL, "default_threshold" integer NOT NULL DEFAULT 1, "default_max_daily_count" integer NOT NULL DEFAULT 24, "default_min_minutes_between_alerts" integer NOT NULL DEFAULT 60, "dashboard_uuid" character varying, CONSTRAINT "PK_50802da9f1d09f275d964dd491f" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "user_notification_setting" ("id" SERIAL NOT NULL, "threshold" integer NOT NULL DEFAULT 1, "min_minutes_between_alerts" integer NOT NULL DEFAULT 60, "daily_count" integer NOT NULL DEFAULT 0, "max_daily_count" integer NOT NULL DEFAULT 24, "sms_enabled" boolean NOT NULL DEFAULT false, "email_enabled" boolean NOT NULL DEFAULT false, "last_notified_date" TIMESTAMP DEFAULT null, "user_edipi" character varying(10), "org_id" integer, "notification_id" character varying, CONSTRAINT "PK_30a898263762c2e6fa9cbcb7bb6" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ADD CONSTRAINT "FK_26a6800e27dec7e079b3d5bd081" FOREIGN KEY ("user_edipi") REFERENCES "user"("edipi") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ADD CONSTRAINT "FK_fedde888f4f4681b5d0efd609f3" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ADD CONSTRAINT "FK_699fedaccc7380d8b8f1c2722dc" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    const notificationRepo = queryRunner.manager.getRepository(Notification);
    await notificationRepo.insert(defaultNotifications);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notification_setting" DROP CONSTRAINT "FK_699fedaccc7380d8b8f1c2722dc"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" DROP CONSTRAINT "FK_fedde888f4f4681b5d0efd609f3"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" DROP CONSTRAINT "FK_26a6800e27dec7e079b3d5bd081"`);
    await queryRunner.query(`DROP TABLE "user_notification_setting"`);
    await queryRunner.query(`DROP TABLE "notification"`);
  }

}
