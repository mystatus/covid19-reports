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
    const existingTemplates = await workspaceTemplateRepo.find();
    await workspaceTemplateRepo.remove(existingTemplates);
    await workspaceTemplateRepo.insert([{
      name: 'Symptom Tracking (Non-PII)',
      description: 'A symptom tracking workspace that does not include Personally Identifiable Information (PII).',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.nonPii,
    }, {
      name: 'Symptom Tracking (PII)',
      description: 'A symptom tracking workspace that includes Personally Identifiable Information (PII).',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMock.pii,
    }, {
      name: 'Symptom Tracking (PHI)',
      description: 'A symptom tracking workspace that includes Protected Health Information (PHI).',
      pii: true,
      phi: true,
      kibanaSavedObjects: kibanaSavedObjectsMock.phi,
    }]);

    const notificationRepo = queryRunner.manager.getRepository(Notification);
    await notificationRepo.save(defaultNotifications);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
