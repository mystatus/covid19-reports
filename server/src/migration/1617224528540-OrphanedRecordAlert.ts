import { MigrationInterface, QueryRunner } from 'typeorm';
import { Notification } from '../api/notification/notification.model';
import { defaultNotifications } from '../api/notification/default-notifications';

export class OrphanedRecordAlert1617224528540 implements MigrationInterface {
  name = 'OrphanedRecordAlert1617224528540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const notificationRepo = queryRunner.manager.getRepository(Notification);
    await notificationRepo.save(defaultNotifications);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const notificationRepo = queryRunner.manager.getRepository(Notification);
    await notificationRepo.delete('orphanedRecordAlert');

  }

}
