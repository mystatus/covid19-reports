import { MigrationInterface, QueryRunner } from "typeorm";
import { Notification } from '../api/notification/notification.model';
import { defaultNotifications } from '../api/notification/default-notifications';
import { WorkspaceTemplate } from '../api/workspace/workspace-template.model';
import { kibanaSavedObjectsMock } from '../kibana/kibana-saved-objects.mock';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../util/error-types';

export class AlertsAndForceHealth1605909623886 implements MigrationInterface {
  name = 'AlertsAndForceHealth1605909623886'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const workspaceTemplateRepo = queryRunner.manager.getRepository(WorkspaceTemplate);

    const nonPii = await workspaceTemplateRepo.findOne({
      where: { name: 'Symptom Tracking (Non-PII)' }
    });

    if (!nonPii) {
      throw new NotFoundError('Non-PII workspace template was not found.');
    }

    const pii = await workspaceTemplateRepo.findOne({
      where: { name: 'Symptom Tracking (PII)' }
    });

    if (!pii) {
      throw new NotFoundError('PII workspace template was not found.');
    }

    const phi = await workspaceTemplateRepo.findOne({
      where: { name: 'Symptom Tracking (PHI)' }
    });

    if (!phi) {
      throw new NotFoundError('PHI workspace template was not found.');
    }

    await workspaceTemplateRepo.update(nonPii.id, {
      name: 'Symptom Tracking (Non-PII)',
      description: 'Symptom tracker without PII data',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.nonPii,
    });

    await workspaceTemplateRepo.update(pii.id, {
      name: 'Symptom Tracking (PII)',
      description: 'Symptom tracker with PII data',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.pii,
    });

    await workspaceTemplateRepo.update(phi.id, {
      name: 'Symptom Tracking (PHI)',
      description: 'Symptom tracker with PHI data',
      pii: true,
      phi: true,
      kibanaSavedObjects: kibanaSavedObjectsMock.phi,
    });

    const notificationRepo = queryRunner.manager.getRepository(Notification);
    await notificationRepo.save(defaultNotifications);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
