import { MigrationInterface, QueryRunner } from 'typeorm';
import { Notification } from '../api/notification/notification.model';
import { defaultNotifications } from '../api/notification/default-notifications';

export class AlertsAndForceHealth1605909623886 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const notificationRepo = queryRunner.manager.getRepository(Notification);
    await notificationRepo.save(defaultNotifications);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
