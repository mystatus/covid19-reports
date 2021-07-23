/* eslint-disable */

import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';
import { WorkspaceTemplate } from '../api/workspace/workspace-template.model';

export class UpdateWorkspaceTemplates1616459364013 implements MigrationInterface {
  name = 'UpdateWorkspaceTemplates1616459364013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const workspaceTemplateRepo = queryRunner.manager.getRepository(WorkspaceTemplate);
    const existingTemplates = await workspaceTemplateRepo.find();
    await workspaceTemplateRepo.remove(existingTemplates);
    await workspaceTemplateRepo.insert([{
      name: 'Symptom Tracking (Non-PII)',
      description: 'A symptom tracking workspace that does not include Personally Identifiable Information (PII).',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMockNew.nonPii,
    }, {
      name: 'Symptom Tracking (PII)',
      description: 'A symptom tracking workspace that includes Personally Identifiable Information (PII).',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMockNew.pii,
    }, {
      name: 'Symptom Tracking (PHI)',
      description: 'A symptom tracking workspace that includes Protected Health Information (PHI).',
      pii: true,
      phi: true,
      kibanaSavedObjects: kibanaSavedObjectsMockNew.phi,
    }, {
      name: 'Blank (Non-PII)',
      description: 'A blank workspace that does not include Personally Identifiable Information (PII).',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMockNew.blank,
    }, {
      name: 'Blank (PII)',
      description: 'A blank workspace that includes Personally Identifiable Information (PII).',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMockNew.blank,
    }, {
      name: 'Blank (PHI)',
      description: 'A blank workspace that includes Protected Health Information (PHI).',
      pii: true,
      phi: true,
      kibanaSavedObjects: kibanaSavedObjectsMockNew.blank,
    }]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const workspaceTemplateRepo = queryRunner.manager.getRepository(WorkspaceTemplate);
    const existingTemplates = await workspaceTemplateRepo.find();
    await workspaceTemplateRepo.remove(existingTemplates);
    await workspaceTemplateRepo.insert([{
      name: 'Symptom Tracking (Non-PII)',
      description: 'A symptom tracking workspace that does not include Personally Identifiable Information (PII).',
      pii: false,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMockPrevious.nonPii,
    }, {
      name: 'Symptom Tracking (PII)',
      description: 'A symptom tracking workspace that includes Personally Identifiable Information (PII).',
      pii: true,
      phi: false,
      kibanaSavedObjects: kibanaSavedObjectsMockPrevious.pii,
    }, {
      name: 'Symptom Tracking (PHI)',
      description: 'A symptom tracking workspace that includes Protected Health Information (PHI).',
      pii: true,
      phi: true,
      kibanaSavedObjects: kibanaSavedObjectsMockPrevious.phi,
    }]);
  }

}

const kibanaSavedObjectsMockPrevious = {
  phi: [
    {
      '_id': '1fe23f40-2440-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': 'testgroup1-*-phi-*',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"EDIPI","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"EDIPI.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.durationMinutes","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.endTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.id.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.reported","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTime","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.startTime.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.timezone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.timezone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Disposition","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Disposition.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Provider Notes","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Provider Notes.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Testing Status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Testing Status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.advancedParty","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.aircrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.billetWorkcenter","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.billetWorkcenter.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdi","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdqar","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.contractNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.contractNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.covid19TestReturnDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dept","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.dept.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.div","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.div.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dscacrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.edipi","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.edipi.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.endDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.firstName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.firstName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.in_rom","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.lastName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastReported","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.phone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.phone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pilot","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pui","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rate","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rate.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rateRank","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rateRank.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rom.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.romRelease","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.romRelease.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom_end","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom_start","type":"conflict","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false,"conflictDescriptions":{"date":["testgroup1-airhawk-phi-es6ddssymptomobs-reports","testgroup1-black_death-phi-es6ddssymptomobs-reports","testgroup1-bloody_bucket-phi-es6ddssymptomobs-reports","testgroup1-devils_in_baggy_pants-phi-es6ddssymptomobs-reports","testgroup1-example_text-phi-es6ddssymptomobs-reports","testgroup1-grey_ghost-phi-es6ddssymptomobs-reports","testgroup1-phantom-phi-es6ddssymptomobs-reports","testgroup1-steel_rain-phi-es6ddssymptomobs-reports"],"text":["testgroup1-blue_ghost-phi-es6ddssymptomobs-reports"]}},{"name":"Roster.rom_start.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.startDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.traveler_or_contact","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.traveler_or_contact.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.undefined","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.undefined.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false}]',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '6541d8b0-2e69-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': '*',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"EDIPI","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"EDIPI.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Disposition","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Disposition.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Provider Notes","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Provider Notes.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Testing Status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Testing Status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.advancedParty","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.aircrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.billetWorkcenter","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.billetWorkcenter.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdi","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdqar","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.contractNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.contractNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.covid19TestReturnDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dscacrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.edipi","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.edipi.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.endDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.firstName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.firstName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.lastName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastReported","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pilot","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pui","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rateRank","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rateRank.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rom.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.romRelease","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.romRelease.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.startDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.undefined","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.undefined.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"config.buildNum","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"config.defaultIndex","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"config.defaultIndex.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.hits","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.optionsJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.panelsJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.refreshInterval.display","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.refreshInterval.pause","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.refreshInterval.section","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.refreshInterval.value","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.timeFrom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.timeRestore","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.timeTo","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.uiStateJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.fieldFormatMap","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"index-pattern.fields","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"index-pattern.intervalName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.notExpandable","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.sourceFilters","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"index-pattern.timeFieldName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.columns","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"search.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.hits","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"search.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.sort","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"search.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"server.uuid","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.hits","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.timelion_chart_height","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_columns","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_interval","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_other_interval","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_rows","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_sheet","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"updated_at","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.accessCount","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.accessDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.createDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.url","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"url.url.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"visualization.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.savedSearchId","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"visualization.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.uiStateJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"visualization.visState","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false}]',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a8de1010-2532-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': '*-reports',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"EDIPI","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"EDIPI.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.durationMinutes","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.endTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.id.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.reported","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTime","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.startTime.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.timezone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.timezone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Disposition","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Disposition.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Provider Notes","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Provider Notes.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Testing Status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Testing Status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.advancedParty","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.aircrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.billetWorkcenter","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.billetWorkcenter.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdi","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdqar","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.contractNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.contractNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.covid19TestReturnDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dept","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.dept.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.div","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.div.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dscacrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.edipi","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.edipi.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.endDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.firstName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.firstName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.in_rom","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.lastName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastReported","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.phone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.phone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pilot","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pui","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rate","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rate.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rateRank","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rateRank.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rom.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.romRelease","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.romRelease.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom_end","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom_start","type":"conflict","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false,"conflictDescriptions":{"date":["testgroup1-airhawk-phi-es6ddssymptomobs-reports","testgroup1-black_death-phi-es6ddssymptomobs-reports","testgroup1-bloody_bucket-phi-es6ddssymptomobs-reports","testgroup1-devils_in_baggy_pants-phi-es6ddssymptomobs-reports","testgroup1-example_text-phi-es6ddssymptomobs-reports","testgroup1-grey_ghost-phi-es6ddssymptomobs-reports","testgroup1-phantom-phi-es6ddssymptomobs-reports","testgroup1-steel_rain-phi-es6ddssymptomobs-reports"],"text":["testgroup1-blue_ghost-phi-es6ddssymptomobs-reports"]}},{"name":"Roster.rom_start.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.startDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.traveler_or_contact","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.traveler_or_contact.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.undefined","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.undefined.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"time_since_obs_hours","type":"number","count":0,"scripted":true,"script":"(new Date().getTime() - doc[\'Timestamp\'].value.getMillis()) / 1000 / 60 / 60","lang":"painless","searchable":true,"aggregatable":true,"readFromDocValues":false}]',
        'fieldFormatMap': '{"time_since_obs_hours":{"id":"number"}}',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster List Text',
        'visState': '{"title":"Muster List Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Muster List\\nList of individuals with the last time they submitted an observation.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Soldier Observation Follow-up\\nA table that displays when the last time an individual submitted a symptoms observation report. Each row in the table shows the EDIPI, the individual\'s phone number, name, lodging, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the three columns."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f4558e30-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Coronavirus Health Text',
        'visState': '{"title":"Coronavirus Health Text","type":"markdown","params":{"fontSize":24,"openLinksInNewTab":false,"markdown":"Coronavirus Exposure / Symptoms\\n---"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e292ffd0-2863-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Alert - Control Board - Base',
        'visState': '{"title":"Alert - Control Board - Base","type":"input_control_vis","params":{"controls":[{"id":"1599843098242","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1599843111344","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605806664606","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Details.Symptoms.keyword","parent":"","label":"Symptoms - Select all that apply (no selection implies all symptoms)","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '6f708620-229c-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Health control board',
        'visState': '{"title":"Health control board","type":"input_control_vis","params":{"controls":[{"id":"1604933946497","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933991588","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933914012","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Details.Symptoms.keyword","parent":"","label":"Symptoms","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933973627","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Details.Conditions.keyword","parent":"","label":"Conditions","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '78114120-2855-11eb-8bde-57c4cf572790',
      '_type': 'visualization',
      '_source': {
        'title': 'Medical Health Aggregation Control Board',
        'visState': '{"title":"Medical Health Aggregation Control Board","type":"input_control_vis","params":{"controls":[{"id":"1605563290045","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"EDIPI.keyword","parent":"","label":"EDIPI","type":"list","options":{"type":"terms","multiselect":false,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605799680710","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Roster.firstName.keyword","parent":"","label":"First","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605799712742","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Roster.lastName.keyword","parent":"","label":"Last","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '91ed9950-eecf-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations over time by Lodging',
        'visState': '{"title":"Observations over time by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '18aa2a20-f444-11ea-82b7-4bc5055cc562',
      '_type': 'visualization',
      '_source': {
        'title': 'Control Board',
        'visState': '{"title":"Control Board","type":"input_control_vis","params":{"controls":[{"id":"1599843098242","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1599843111344","indexPattern":"a8de1010-2532-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '308b9ce0-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Condition Share',
        'visState': '{"title":"Condition Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '496c5380-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom Share',
        'visState': '{"title":"Symptom Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '29154300-4533-11eb-ad41-4d6b4e8c461f',
      '_type': 'visualization',
      '_source': {
        'title': 'Controls - Unit Selector',
        'visState': '{"title":"Controls - Unit Selector","type":"input_control_vis","params":{"controls":[{"id":"1608737092395","indexPattern":"1fe23f40-2440-11eb-aa43-cf97fefcff0e","fieldName":"Details.Unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '09c49db0-e94f-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Data Quality Issues Text',
        'visState': '{"title":"Data Quality Issues Text","type":"markdown","params":{"fontSize":24,"openLinksInNewTab":false,"markdown":"Data Quality / Issues\\n---"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '353451a0-f8e2-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals That Would Like to Talk to Someone Text',
        'visState': '{"title":"Individuals That Would Like to Talk to Someone Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Individuals That Would Like to Talk to Someone\\nList of individuals that indicated they \\"would like to talk someone\\" in their submission\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Talk To Someone Recency Board\\nA table that shows all individuals who want to talk to someone. Each row in the table shows the EDIPI, name, phone, lodging, unit, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the columns."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c8f9d790-e94a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Individuals',
        'visState': '{"title":"Total Individuals","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"cardinality","schema":"metric","params":{"field":"EDIPI.keyword","customLabel":"Persons"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b1526e90-eecc-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort At-Risk Individual Count by Lodging',
        'visState': '{"title":"Cohort At-Risk Individual Count by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count of Individuals with \\"High\\" or \\"Very High\\" observation"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count of Individuals with \\"High\\" or \\"Very High\\" observation","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"cardinality","schema":"metric","params":{"field":"EDIPI.keyword","customLabel":"Count of Individuals with \\"High\\" or \\"Very High\\" observation"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":false,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"meta":{"index":"52a6e670-f442-11ea-82b7-4bc5055cc562","type":"phrases","key":"Category.keyword","value":"high, very_high","params":["high","very_high"],"negate":false,"disabled":false,"alias":null},"query":{"bool":{"should":[{"match_phrase":{"Category.keyword":"high"}},{"match_phrase":{"Category.keyword":"very_high"}}],"minimum_should_match":1}},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '6d948390-e94b-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations by Unit and Lodging',
        'visState': '{"title":"Observations by Unit and Lodging","type":"histogram","params":{"type":"histogram","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"histogram","mode":"stacked","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Unit.keyword","size":500,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'd3be0d70-eec4-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom prevalence by Lodging',
        'visState': '{"title":"Symptom prevalence by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"4","enabled":true,"type":"terms","schema":"split","params":{"field":"Details.Lodging.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","row":true}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '12409630-29ee-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals by Category',
        'visState': '{"title":"Individuals by Category","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '4fef2150-e93d-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort coronavirus risk',
        'visState': '{"title":"Cohort coronavirus risk","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1c7a8120-f446-11ea-82b7-4bc5055cc562',
      '_type': 'dashboard',
      '_source': {
        'title': 'Muster List',
        'hits': 0,
        'description': 'List of individuals with the last time they submitted an observation.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":0,"y":15,"w":48,"h":31,"i":"1"},"id":"bbabdb50-eecd-11ea-aec4-4103718388c0","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":48,"h":15,"i":"2"},"id":"cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1","panelIndex":"2","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-24h',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'd2f7e8d0-3c98-11eb-aa43-cf97fefcff0e',
      '_type': 'search',
      '_source': {
        'title': 'DAVE - Individuals Mustered',
        'description': '',
        'hits': 0,
        'columns': [
          'Timestamp',
          'Browser.TimeZone',
          'Roster.edipi',
          'Roster.lastReported',
          'Details.Unit',
        ],
        'sort': [
          'Timestamp',
          'desc',
        ],
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"6541d8b0-2e69-11eb-aa43-cf97fefcff0e","highlightAll":true,"version":true,"query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c9198a80-2514-11eb-aa43-cf97fefcff0e',
      '_type': 'search',
      '_source': {
        'title': 'Alert - User Needs Medical Attention - Base',
        'description': '',
        'hits': 0,
        'columns': [
          'Roster.unit',
          'Category',
          'Details.TemperatureFahrenheit',
          'Details.TalkToSomeone',
          'Score',
        ],
        'sort': [
          'Timestamp',
          'desc',
        ],
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","highlightAll":true,"version":true,"query":{"language":"kuery","query":"(Category.keyword  :  \\"very high\\" ) or (Category.keyword  : \\"high\\" ) or (Category.keyword : \\"medium\\" ) or (Details.TemperatureFahrenheit >= 102) or (Details.TalkToSomeone :  1)"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5c298f90-eecf-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Talk to someone Observation Share',
        'visState': '{"title":"Talk to someone Observation Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.TalkToSomeone","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '783c2c90-eecc-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Symptom and Condition Prevalence by Lodging',
        'visState': '{"title":"Cohort Symptom and Condition Prevalence by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'ebe2c2e0-eecb-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions prevalence by Lodging',
        'visState': '{"title":"Conditions prevalence by Lodging","type":"line","params":{"addLegend":true,"addTimeMarker":false,"addTooltip":true,"categoryAxes":[{"id":"CategoryAxis-1","labels":{"show":true,"truncate":100},"position":"bottom","scale":{"type":"linear"},"show":true,"style":{},"title":{},"type":"category"}],"grid":{"categoryLines":false,"style":{"color":"#eee"}},"legendPosition":"right","seriesParams":[{"data":{"id":"1","label":"Count"},"drawLinesBetweenPoints":true,"mode":"normal","show":"true","showCircles":true,"type":"line","valueAxis":"ValueAxis-1"}],"times":[],"type":"line","valueAxes":[{"id":"ValueAxis-1","labels":{"filter":false,"rotate":0,"show":true,"truncate":100},"name":"LeftAxis-1","position":"left","scale":{"mode":"normal","type":"linear"},"show":true,"style":{},"title":{"text":"Count"},"type":"value"}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Conditions.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"4","enabled":true,"type":"terms","schema":"split","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","row":true}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'dd03d8d0-e94a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Observations',
        'visState': '{"title":"Total Observations","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total Observations"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c95255a0-e93b-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Anxiety / Concern',
        'visState': '{"title":"Cohort Anxiety / Concern","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Sum of Details.TalkToSomeone"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Sum of Details.TalkToSomeone","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"sum","schema":"metric","params":{"field":"Details.TalkToSomeone"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '354112d0-e93f-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Symptom and Condition Prevalence',
        'visState': '{"title":"Cohort Symptom and Condition Prevalence","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cf5f1900-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Application Share',
        'visState': '{"title":"Application Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Client.Application.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '9d2f98b0-eecd-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations by Time',
        'visState': '{"title":"Observations by Time","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bbabdb50-eecd-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Soldier Observation follow-up',
        'visState': '{"title":"Soldier Observation follow-up","type":"table","params":{"perPage":20,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":2,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Timestamp","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Date Time of Last Observation"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"time_since_obs_hours","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Hours Since Last Observation"},"hidden":false},{"id":"4","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Details.PhoneNumber.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Phone"},"hidden":false},{"id":"7","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":2,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '4e827950-e93a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Talk to someone recency board',
        'visState': '{"title":"Talk to someone recency board","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":1,"direction":"desc"},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"4","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Timestamp","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc"},"hidden":false},{"id":"1","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Details.TalkToSomeone","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Talk to Someone"},"hidden":false},{"id":"5","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"time_since_obs_hours","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Hours since observation"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First"},"hidden":false},{"id":"7","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last"},"hidden":false},{"id":"8","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Details.PhoneNumber.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Phone"},"hidden":false},{"id":"9","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"meta":{"index":"9b3b4f90-e937-11ea-b481-91d592e28f0d","negate":false,"disabled":false,"alias":null,"type":"phrase","key":"Details.TalkToSomeone","value":1,"params":{"query":1,"type":"phrase"}},"query":{"match":{"Details.TalkToSomeone":{"query":1,"type":"phrase"}}},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'ce0996b0-eece-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Individual Compliance',
        'visState': '{"title":"Individual Compliance","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total Observations"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":""},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First"},"hidden":false},{"id":"4","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7afa6720-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions by Lodging',
        'visState': '{"title":"Conditions by Lodging","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Conditions"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Lodging"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 12":"rgb(247,252,245)","12 - 23":"rgb(199,233,192)","23 - 34":"rgb(116,196,118)","34 - 45":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e201d150-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Observations',
        'visState': '{"title":"Total Observations","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f4b06bd0-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total symptoms reported by Unit',
        'visState': '{"title":"Total symptoms reported by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Total symptoms reported"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Total symptoms reported","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total symptoms reported"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c39b0090-229c-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions tracking',
        'visState': '{"title":"Conditions tracking","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b976ad90-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom tracking',
        'visState': '{"title":"Symptom tracking","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Number reporting given symptom"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Number reporting given symptom","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Number reporting given symptom"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{},"customLabel":""},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '8e685260-2a94-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Average Risk Score',
        'visState': '{"title":"Average Risk Score","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Risk Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Risk Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score","customLabel":"Average Risk Score"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e2e816d0-29e6-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals Per Risk Category',
        'visState': '{"title":"Individuals Per Risk Category","type":"line","params":{"addLegend":true,"addTimeMarker":false,"addTooltip":true,"categoryAxes":[{"id":"CategoryAxis-1","labels":{"show":true,"truncate":100},"position":"bottom","scale":{"type":"linear"},"show":true,"style":{},"title":{},"type":"category"}],"grid":{"categoryLines":false,"style":{"color":"#eee"}},"legendPosition":"right","seriesParams":[{"data":{"id":"1","label":"Count"},"drawLinesBetweenPoints":true,"mode":"normal","show":"true","showCircles":true,"type":"line","valueAxis":"ValueAxis-1"}],"times":[],"type":"line","valueAxes":[{"id":"ValueAxis-1","labels":{"filter":false,"rotate":0,"show":true,"truncate":100},"name":"LeftAxis-1","position":"left","scale":{"mode":"normal","type":"linear"},"show":true,"style":{},"title":{"text":"Count"},"type":"value"}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a0eeda70-229d-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom reports by Unit Heatmap',
        'visState': '{"title":"Symptom reports by Unit Heatmap","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 65":"rgb(247,252,245)","65 - 130":"rgb(199,233,192)","130 - 195":"rgb(116,196,118)","195 - 260":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '800b9af0-2a95-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'At-risk individuals by Unit',
        'visState': '{"title":"At-risk individuals by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"should":[{"terms":{"Category.keyword":["very high","high"]}},{"bool":{"must":[{"term":{"Category.keyword":"medium"}},{"range":{"Details.TemperatureFahrenheit":{"gte":102}}}]}}]}},"meta":{"negate":false,"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","disabled":false,"alias":"v. high, high, or (medium and temp >= 102)","type":"custom","key":"query","value":"{\\"bool\\":{\\"should\\":[{\\"terms\\":{\\"Category.keyword\\":[\\"very high\\",\\"high\\"]}},{\\"bool\\":{\\"must\\":[{\\"term\\":{\\"Category.keyword\\":\\"medium\\"}},{\\"range\\":{\\"Details.TemperatureFahrenheit\\":{\\"gte\\":102}}}]}}]}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1885c850-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Condition reports by Unit Heatmap',
        'visState': '{"title":"Condition reports by Unit Heatmap","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 50":"rgb(247,252,245)","50 - 100":"rgb(199,233,192)","100 - 150":"rgb(116,196,118)","150 - 200":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '57e71030-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom reports by Lodging',
        'visState': '{"title":"Symptom reports by Lodging","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":49997,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Symptoms"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Lodging"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 12":"rgb(247,252,245)","12 - 23":"rgb(199,233,192)","23 - 34":"rgb(116,196,118)","34 - 45":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'fed0e760-e93a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Anxiety / Concern Monitoring',
        'visState': '{"title":"Anxiety / Concern Monitoring","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":1,"direction":"desc"},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":10000,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"EDIPI"},"hidden":false},{"id":"3","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Roster.firstName","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"First Name"},"hidden":false},{"id":"4","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Roster.lastName","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Last Name"},"hidden":false},{"id":"5","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Details.PhoneNumber","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Phone Number"},"hidden":false},{"id":"6","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Details.Unit","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc"},"hidden":false},{"id":"1","enabled":true,"type":"sum","schema":"metric","params":{"field":"Details.TalkToSomeone","customLabel":"Number of times asked to talk to someone"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '40f18f20-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Units',
        'visState': '{"title":"Total Units","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"cardinality","schema":"metric","params":{"field":"_index","customLabel":"Total Units"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '4b3ee1e0-e94c-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Recent Individuals at risk of COVID exposure',
        'visState': '{"title":"Recent Individuals at risk of COVID exposure","type":"table","params":{"perPage":20,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":3,"direction":"asc"},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"1","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Details.Symptoms","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc"},"hidden":false},{"id":"9","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Details.Conditions","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc"},"hidden":false},{"id":"3","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Timestamp","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First"},"hidden":false},{"id":"4","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"time_since_obs_hours","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last"},"hidden":false},{"id":"7","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Details.PhoneNumber.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Phone"},"hidden":false},{"id":"8","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":3,"direction":"asc"}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"meta":{"index":"52a6e670-f442-11ea-82b7-4bc5055cc562","type":"phrases","key":"Category.keyword","value":"high, very_high","params":["high","very_high"],"negate":false,"disabled":false,"alias":null},"query":{"bool":{"should":[{"match_phrase":{"Category.keyword":"high"}},{"match_phrase":{"Category.keyword":"very_high"}}],"minimum_should_match":1}},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b1195610-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Servicemember symptoms report',
        'visState': '{"title":"Servicemember symptoms report","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Observations with symptoms or conditions"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"filter":{"bool":{"should":[{"exists":{"field":"Details.Symptoms.keyword"}},{"exists":{"field":"Details.Conditions.keyword"}}]}}}},"meta":{"negate":false,"index":"9b3b4f90-e937-11ea-b481-91d592e28f0d","disabled":false,"alias":"Conditions OR Symptoms Exist","type":"custom","key":"query","value":"{\\"bool\\":{\\"filter\\":{\\"bool\\":{\\"should\\":[{\\"exists\\":{\\"field\\":\\"Details.Symptoms.keyword\\"}},{\\"exists\\":{\\"field\\":\\"Details.Conditions.keyword\\"}}]}}}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'db29cdc0-2929-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Max Score Per Day',
        'visState': '{"title":"Max Score Per Day","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Max Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Max Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"bottom","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"max","schema":"metric","params":{"field":"Score","customLabel":"Max Score"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{},"customLabel":"Date"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"EDIPI.keyword","size":50000000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'aded5c30-2854-11eb-8bde-57c4cf572790',
      '_type': 'visualization',
      '_source': {
        'title': 'Daily Symptoms',
        'visState': '{"title":"Daily Symptoms","type":"table","params":{"perPage":14,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":3,"direction":"desc"},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000000,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"EDIPI"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":true,"missingBucketLabel":"Missing","customLabel":"First Name"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":1,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":true,"missingBucketLabel":"Missing","customLabel":"Last Name"},"hidden":false},{"id":"3","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Details.Symptoms","aggregate":"concat","size":5,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Symptoms"},"hidden":false},{"id":"7","enabled":true,"type":"max","schema":"metric","params":{"field":"Score","customLabel":"Max Score"},"hidden":false},{"id":"9","enabled":true,"type":"date_histogram","schema":"bucket","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{},"customLabel":"Day"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":3,"direction":"desc"}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '8c85ee40-544b-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster timing',
        'visState': '{"title":"Muster timing","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Muster.status.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bd1983b0-51f7-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Daily Muster Non-Compliance',
        'visState': '{"title":"Daily Muster Non-Compliance","type":"area","params":{"type":"area","grid":{"categoryLines":false,"style":{"color":"#eee"},"valueAxis":null},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"percentage","defaultYExtents":false},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Percentage"}}],"seriesParams":[{"show":"true","type":"area","mode":"stacked","data":{"label":"Count","id":"1"},"drawLinesBetweenPoints":true,"showCircles":true,"interpolate":"linear","valueAxis":"ValueAxis-1"}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"filters","schema":"group","params":{"filters":[{"input":{"query":"Muster.reported: false"},"label":"Number NOT reporting"},{"input":{"query":"Muster.reported: true"},"label":"Number Reporting"}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"colors":{"Number NOT reporting":"#E24D42","Number Reporting":"#BADFF4"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '0df55b40-51eb-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Unit Muster Non-Compliance rate',
        'visState': '{"title":"Unit Muster Non-Compliance rate","type":"enhanced-table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum","computedColumns":[{"label":"Muster non-compliance rate","formula":"col2 / col1","format":"number","pattern":"0,0%","alignment":"left","applyAlignmentOnTitle":true,"applyAlignmentOnTotal":true,"applyTemplate":false,"applyTemplateOnTotal":true,"template":"{{value}}","enabled":true}],"computedColsPerSplitCol":false,"hideExportLinks":false,"showFilterBar":false,"filterCaseSensitive":false,"filterBarHideable":false,"filterAsYouType":false,"filterTermsSeparately":false,"filterHighlightResults":false,"filterBarWidth":"25%","hiddenColumns":"1,2"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"2","enabled":true,"type":"filters","schema":"splitcols","params":{"filters":[{"input":{"query":"*"},"label":""},{"input":{"query":"Muster.reported: false"}}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f1a95bb0-eeb9-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Mental Health',
        'hits': 0,
        'description': 'A dashboard for relevantly tracking the "Talk to someone" field from service member submissions.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":25,"y":0,"w":11,"h":17,"i":"2"},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":36,"y":0,"w":12,"h":17,"i":"3"},"id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","panelIndex":"3","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":16,"y":57,"w":32,"h":14,"i":"4"},"id":"c95255a0-e93b-11ea-b481-91d592e28f0d","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":9,"y":32,"w":39,"h":15,"i":"5"},"id":"fed0e760-e93a-11ea-b481-91d592e28f0d","panelIndex":"5","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":57,"w":16,"h":14,"i":"7"},"id":"5c298f90-eecf-11ea-aec4-4103718388c0","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":12,"y":0,"w":13,"h":17,"i":"8"},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":12,"h":17,"i":"9"},"id":"e25abde0-e94e-11ea-b481-91d592e28f0d","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":9,"y":17,"w":39,"h":15,"i":"10"},"id":"4e827950-e93a-11ea-b481-91d592e28f0d","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":17,"w":9,"h":30,"i":"11"},"id":"e4dbae10-618c-11eb-ab11-f728fb6de5ec","panelIndex":"11","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":47,"w":48,"h":10,"i":"12"},"version":"6.4.1","panelIndex":"12","type":"visualization","id":"89db5d70-618d-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-14d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '3e5fd4d0-f445-11ea-82b7-4bc5055cc562',
      '_type': 'dashboard',
      '_source': {
        'title': 'Individual needs medical attention',
        'hits': 0,
        'description': 'List of individuals at high risk of exposure to coronavirus based on their symptom submission',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"h":31,"i":"1","w":48,"x":0,"y":15},"id":"4b3ee1e0-e94c-11ea-b481-91d592e28f0d","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"2","w":35,"x":0,"y":0},"id":"7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"3","w":13,"x":35,"y":0},"id":"29154300-4533-11eb-ad41-4d6b4e8c461f","panelIndex":"3","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-24h',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'afcaefb0-253c-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Symptom Trending',
        'hits': 0,
        'description': 'Trends of Symptoms and Individual Health Categories over time.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":31,"y":0,"w":17,"h":15,"i":"2"},"id":"e292ffd0-2863-11eb-aa43-cf97fefcff0e","panelIndex":"2","title":"Filters","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":31,"h":15,"i":"3"},"id":"179bb360-2865-11eb-aa43-cf97fefcff0e","panelIndex":"3","title":"Dashboard Description","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":30,"w":48,"h":17,"i":"6"},"id":"12409630-29ee-11eb-aa43-cf97fefcff0e","panelIndex":"6","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":15,"w":48,"h":15,"i":"7"},"version":"6.4.1","panelIndex":"7","type":"visualization","id":"15be3790-618e-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-7d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '179bb360-2865-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom trending - Text - Base',
        'visState': '{"title":"Symptom trending - Text - Base","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Symptom Trending\\nLine chart of symptoms trending over time.\\n\\nLine chart of the count of individuals in their respective categories over time.\\n\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 24 Hours\\".\\n\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n\\n#### Individual Needs Medical Attention Line Chart\\nMulti-line graph where each line and color shows the number of symptoms observations received throughout the time window as specified by the time filter in 12-hour time intervals. Each line and color represents a specific symptom. You may filter out specific symptoms by clicking on the symptom name on the right side of the graph.\\n\\n#### Individuals by Category\\nThis is a multi-line graph depicting the number of observations across all units along with their corresponding \\"category\\" of coronavirus exposure risk based on the reported symptoms and conditions, in accordance with DDS\'s [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator)."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '15be3790-618e-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom Trending Line Graph',
        'visState': '{"title":"Symptom Trending Line Graph","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e4dbae10-618c-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental health tables explanation text',
        'visState': '{"title":"Mental health tables explanation text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The tables to the right convey the following information:\\n#### Talk to Someone recency board\\n\\nA list of individuals who have indicated that they would like to talk to someone. Sort this list by the \\"Last Timestamp\\" column to bring the most recent individuals to the top.\\n\\n#### Anxiety / Concern Monitoring\\n\\nA list of individuals along with the total number of times they have asked to talk to someone. A higher number here may indicate a servicemember is in need of mental health attention or increased monitoring"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '89db5d70-618d-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental health graphs explanation',
        'visState': '{"title":"Mental health graphs explanation","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The graphs below provide the following:\\n\\n\\n#### Cohort Anxiety / Concern\\n\\nThe total number of symptom observations indicating a need to talk to someone over time. This should serve as an indicator of overall mental health among a cohort of servicemembers.\\n\\n#### Talk to someone observation share\\n\\nThe total share of observations indicating a need to talk to someone versus those that made no indication. This gives an overall view of mental health of the cohort during the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e25abde0-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental Health Text',
        'visState': '{"title":"Mental Health Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"Mental Health\\n---\\n\\n#### Control Board\\n\\nControls for selecting unit and lodging filters to be applied to the other visualizations\\n\\n#### Total Individuals\\nThe total number of unique individuals that have submitted observations\\n\\n#### Total Observations\\n\\nThe total number of symptom observations given within the specified time range"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '2f5db6e0-eeba-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Muster Non-Compliance',
        'hits': 0,
        'description': 'A Dashboard for examining muster non-compliance across a cohort',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"h":15,"i":"2","w":8,"x":28,"y":0},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"9","w":13,"x":15,"y":0},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":29,"i":"10","w":15,"x":0,"y":0},"id":"82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"11","w":24,"x":0,"y":44},"id":"bd1983b0-51f7-11eb-b1c2-819d629adfcd","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":14,"i":"12","w":33,"x":15,"y":15},"id":"7fd3b4b0-51ea-11eb-b1c2-819d629adfcd","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"13","w":12,"x":36,"y":0},"id":"0df55b40-51eb-11eb-b1c2-819d629adfcd","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"14","w":24,"x":24,"y":44},"id":"8c85ee40-544b-11eb-b1c2-819d629adfcd","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"15","w":48,"x":0,"y":29},"id":"abab3d40-61a0-11eb-ab11-f728fb6de5ec","panelIndex":"15","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-5y',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7fd3b4b0-51ea-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Servicemember Muster Non-Compliance Rate',
        'visState': '{"title":"Servicemember Muster Non-Compliance Rate","type":"enhanced-table","params":{"computedColsPerSplitCol":false,"computedColumns":[{"label":"Muster non-compliance rate","formula":"col5 / col4","format":"number","pattern":"0,0%","alignment":"left","applyAlignmentOnTitle":true,"applyAlignmentOnTotal":true,"applyTemplate":false,"applyTemplateOnTotal":true,"template":"{{value}}","enabled":true}],"filterAsYouType":false,"filterBarHideable":false,"filterBarWidth":"25%","filterCaseSensitive":false,"filterHighlightResults":false,"filterTermsSeparately":false,"hideExportLinks":false,"perPage":10,"showFilterBar":false,"showMetricsAtAllLevels":false,"showPartialRows":false,"showTotal":false,"sort":{"columnIndex":null,"direction":null},"totalFunc":"sum","hiddenColumns":"4,5"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"4","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"EDIPI"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First Name"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last Name"},"hidden":false},{"id":"7","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.phone.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"filters","schema":"splitcols","params":{"filters":[{"input":{"query":"*"},"label":""},{"input":{"query":"Muster.reported: false"}}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"language":"kuery","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Coronavirus At-risk Individuals Follow-Up Text',
        'visState': '{"title":"Coronavirus At-risk Individuals Follow-Up Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Individual needs medical attention\\nList of individuals at high risk of exposure to coronavirus based on their symptom submission.\\n\\"**At-risk**\\" is defined as any individual whose combination of reported symptoms, conditions, and temperature results in a categorization of \\"high\\" or \\"very_high\\" risk of coronavirus exposure in accordance with DDS\'s [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 24 Hours\\".\\n#### Recent Individuals at Risk of COVID-19 Exposure\\nA filtered table that shows the reporting status of only individuals who are deemed at risk for COVID-19 exposure. Each row in the table shows the EDIPI, score, risk exposure by category, date and time of last observation, temperature and the number of hours since the last observation.  You may sort by any of the columns.\\nIf an individual submits symptoms multiple times within the time period, this table displays the most recent data."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'abab3d40-61a0-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster non-compliance graph text',
        'visState': '{"title":"Muster non-compliance graph text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The graphs below provide the following information:\\n\\n#### Daily Muster Non-Compliance\\nA graph showing muster compliance on a daily basis for the given time period and filters. If a very long time period such as years is selected, the graph will aggregate over longer segments of time than a day.\\n\\n#### Muster Timing\\nA multi-line graph showing the general timing of muster reports by individuals.\\n- *Early* - The report was provided **before** the appointed muster time-window.\\n- *Late* - The report was provided **after** the appointed muster time-window.\\n- *On-time* - The report was provided **during** the appointed muster time-window.\\n- *Non-Reporting* - **No report was provided** any time within the vicinity of the muster time-window, defined as the halfway point between the close of one muster reporting time-window and the beginning of another."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster Compliance Text',
        'visState': '{"title":"Muster Compliance Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Muster Non-Compliance\\nA dashboard supplying various ways of examining muster non-compliance across a cohort.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Individuals\\nThe total number of individuals who reported symptoms.\\n#### Unit Muster Non-Compliance Rate\\nA table of units along with the percentage of times individuals in the unit did not report during muster for the given time period.\\n#### Servicemember Muster Non-Compliance Rate\\nA table of individuals along with the percentage of times that they have not reported during muster for the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom Tracking Text',
        'visState': '{"title":"Health / Symptom Tracking Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Health / Symptom Tracking\\nA dashboard for tracking servicemember symptoms and coronavirus exposure potential\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of symptoms observations. \\n#### Total Individuals\\nThe total number of individuals who reported symptoms."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '061fb350-eeba-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Health / Symptom Tracking',
        'hits': 0,
        'description': 'A dashboard for tracking soldier symptoms and coronavirus exposure potential',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":14,"y":79,"w":34,"h":12,"i":"1"},"id":"4fef2150-e93d-11ea-b481-91d592e28f0d","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":14,"y":67,"w":34,"h":12,"i":"2"},"id":"354112d0-e93f-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":21,"y":12,"w":27,"h":8,"i":"4"},"id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":35,"y":0,"w":13,"h":12,"i":"6"},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"6","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":52,"w":24,"h":15,"i":"7"},"id":"b1195610-e94e-11ea-b481-91d592e28f0d","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":123,"w":24,"h":46,"i":"8"},"id":"d3be0d70-eec4-11ea-aec4-4103718388c0","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":123,"w":24,"h":46,"i":"9"},"id":"ebe2c2e0-eecb-11ea-aec4-4103718388c0","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":108,"w":24,"h":15,"i":"10"},"id":"783c2c90-eecc-11ea-aec4-4103718388c0","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":108,"w":24,"h":15,"i":"11"},"id":"b1526e90-eecc-11ea-aec4-4103718388c0","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":37,"w":24,"h":15,"i":"12"},"id":"308b9ce0-e946-11ea-b481-91d592e28f0d","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":37,"w":24,"h":15,"i":"13"},"id":"496c5380-e946-11ea-b481-91d592e28f0d","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":21,"y":0,"w":14,"h":12,"i":"14"},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":21,"h":20,"i":"15"},"id":"1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1","panelIndex":"15","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":20,"w":48,"h":17,"i":"16"},"id":"55ae0f90-61a9-11eb-ab11-f728fb6de5ec","panelIndex":"16","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":52,"w":24,"h":15,"i":"17"},"id":"bf289fd0-61a9-11eb-ab11-f728fb6de5ec","panelIndex":"17","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":67,"w":14,"h":24,"i":"18"},"id":"cb8f07b0-61b7-11eb-ab11-f728fb6de5ec","panelIndex":"18","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":91,"w":48,"h":17,"i":"20"},"version":"6.4.1","panelIndex":"20","type":"visualization","id":"b79376a0-61bd-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-7d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '01bd38c0-229d-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Conditions reported by Unit',
        'visState': '{"title":"Total Conditions reported by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Total conditions reported"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Total conditions reported","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total conditions reported"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bf289fd0-61a9-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Unit Symptom Health',
        'visState': '{"title":"Unit Symptom Health","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Observations with symptoms or conditions"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"filter":{"bool":{"should":[{"exists":{"field":"Details.Symptoms.keyword"}},{"exists":{"field":"Details.Conditions.keyword"}}]}}}},"meta":{"negate":false,"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","disabled":false,"alias":"Conditions OR Symptoms Exist","type":"custom","key":"query","value":"{\\"bool\\":{\\"filter\\":{\\"bool\\":{\\"should\\":[{\\"exists\\":{\\"field\\":\\"Details.Symptoms.keyword\\"}},{\\"exists\\":{\\"field\\":\\"Details.Conditions.keyword\\"}}]}}}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b79376a0-61bd-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom lodging text',
        'visState': '{"title":"Health / Symptom lodging text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following graphs below all provide information related to health and symptoms across lodging. **If such a variable does not make sense for your situation, e.g. you operate on a ship, then you can safely ignore these graphs**. They provide the following information:\\n\\n#### Cohort Symptom and Condition Prevalence by Lodging\\nProvides the average risk score of observations by lodging\\n\\n#### Cohort At-risk Individual Count by Lodging\\nProvides the number of at-risk observations per lodging.  An \\"at-risk\\" observation is one in which the risk category is \\"high\\" or \\"very high\\" as determined by the DDS coronavirus calculator.\\n\\n#### Symptom Prevalence by Lodging\\nA graph providing the number of observations containing given symptoms by lodging. Note that symptoms are provided as a list. A single observation may have multiple concurrent symptoms.\\n\\n#### Condition Prevalence by Lodging\\nA graph providing the number of observations containing given conditions by lodging. Note that conditions are provided as a list. A single observation may have multiple concurrent symptoms."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cb8f07b0-61b7-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptoms risk explanation',
        'visState': '{"title":"Health / Symptoms risk explanation","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The two graphs on the right convey concepts related to individuals\' risk of coronavirus exposure. Details of the  used to produce Documentation for the scores and categories used by these graphs can be found in the [DDS created coronavirus calculator](https://github.com/deptofdefense/covid19-calculator). The graphs convey the following:\\n\\n#### Cohort Symptom and Condition prevalence\\nA line graph conveying the average coronavirus risk score of the cohort over the specified time period. For an individual report, a risk score over 40 would be considered \'high\' and a risk score over 70 would be considered \'very high\'.\\n\\n#### Cohort Coronavirus Risk\\nA multi-line graph providing counts of observations by coronavirus risk category, as defined by DDS\'s coronavirus risk calculator, over the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5902bef0-6250-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health risk symptom text',
        'visState': '{"title":"Force health risk symptom text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The four graphs below convey the following:\\n\\n#### Average Risk Score\\nThe average risk score of the cohort for the given time period. For individual observations, a score of 40 or higher would be classified as \'high\' risk, and a score of \'70\' or higher would be classified as \'very high\' risk.\\n\\n#### Individuals per Risk Category\\nA line graph providing the number of observations belonging to each category of coronavirus exposure risk as determined according to [DDS\'s coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Symptom Tracking\\nThe numbers of given symptoms reported in a particular time period. Note that single observations can contain multiple symptoms.\\n\\n#### Condition Tracking\\nThe numbers of given conditions reported in a particular time period. Note that single observations can contain multiple conditions."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '9bf611c0-6251-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health unit summary graphs text',
        'visState': '{"title":"Force health unit summary graphs text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The following three graphs below and to the right provide risk metrics on a per unit basis:\\n\\n#### At-risk Individuals by Unit\\nThe total number of observations that are \'at-risk\' from a given unit over a given time period. An \'at-risk\' observation is one that is classified as \'high\' or \'very high\' risk by the [DDS coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Total Symptoms reported by Unit\\nThe total number of observations containing symptoms coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\\n\\n#### Total Conditions reported by Unit\\nThe total number of observations containing conditions coming from a given unit. This should show whether some units are being harder hit than others by illnesses."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b5c163d0-61bf-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force Health Dashboard Intro text',
        'visState': '{"title":"Force Health Dashboard Intro text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"# Force Health Dashboard\\nThis dashboard provides a number of visualizations related to examining and exploring force health.\\n\\n#### Health Control Board\\nA set of controls for setting filters on unit, lodging, symptoms, or conditions. Choose apply changes to change the filters.\\n\\n#### Total Individuals\\nThe total number of individuals making up the cohort under examination.\\n\\n#### Total Units\\nThe total number of units represented by individuals making up the cohort under examination."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a2f3d060-6252-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health heatmaps text',
        'visState': '{"title":"Force health heatmaps text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following four heat maps provide a breakdown of particular symptom and condition prevalence across units and lodgings. These visualizations can be useful for examining potential \\"hot-spots\\" of symptoms / conditions linked either to units or lodging over the course of a period of time. If the concept of lodging does not make sense for your situation, e.g. you operate on a ship, then you may safely ignore the heatmaps related to lodging:\\n\\n#### Symptom reports by Unit Heatmap\\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-symptom basis.\\n\\n\\n#### Condition reports by Unit Heatmap \\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-condition basis.\\n\\n#### Symptom reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-symptom basis.\\n\\n#### Condition reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-condition basis."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c3644b10-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Force Health',
        'hits': 0,
        'description': 'Monitoring overall health of the force',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":38,"y":0,"w":10,"h":21,"i":"2"},"id":"40f18f20-229b-11eb-aa43-cf97fefcff0e","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":50,"w":24,"h":12,"i":"3"},"id":"b976ad90-229b-11eb-aa43-cf97fefcff0e","panelIndex":"3","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":78,"w":24,"h":15,"i":"4"},"id":"f4b06bd0-229b-11eb-aa43-cf97fefcff0e","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":14,"y":0,"w":13,"h":21,"i":"5"},"id":"6f708620-229c-11eb-aa43-cf97fefcff0e","panelIndex":"5","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":50,"w":24,"h":12,"i":"6"},"id":"c39b0090-229c-11eb-aa43-cf97fefcff0e","panelIndex":"6","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":78,"w":24,"h":15,"i":"7"},"id":"01bd38c0-229d-11eb-aa43-cf97fefcff0e","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":111,"w":24,"h":19,"i":"8"},"id":"a0eeda70-229d-11eb-aa43-cf97fefcff0e","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":111,"w":24,"h":19,"i":"9"},"id":"1885c850-229e-11eb-aa43-cf97fefcff0e","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":130,"w":24,"h":15,"i":"10"},"id":"57e71030-229e-11eb-aa43-cf97fefcff0e","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":130,"w":24,"h":15,"i":"11"},"id":"7afa6720-229e-11eb-aa43-cf97fefcff0e","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":37,"w":24,"h":13,"i":"12"},"id":"e2e816d0-29e6-11eb-aa43-cf97fefcff0e","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":37,"w":24,"h":13,"i":"13"},"id":"8e685260-2a94-11eb-aa43-cf97fefcff0e","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":62,"w":24,"h":16,"i":"14"},"id":"800b9af0-2a95-11eb-aa43-cf97fefcff0e","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":14,"h":21,"i":"15"},"id":"b5c163d0-61bf-11eb-ab11-f728fb6de5ec","panelIndex":"15","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":27,"y":0,"w":11,"h":21,"i":"16"},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"16","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":21,"w":48,"h":16,"i":"17"},"id":"5902bef0-6250-11eb-ab11-f728fb6de5ec","panelIndex":"17","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":62,"w":24,"h":16,"i":"18"},"id":"9bf611c0-6251-11eb-ab11-f728fb6de5ec","panelIndex":"18","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":93,"w":48,"h":18,"i":"19"},"version":"6.4.1","panelIndex":"19","type":"visualization","id":"a2f3d060-6252-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-14d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1fc60b10-292a-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Med Health Agg Report MD',
        'visState': '{"title":"Med Health Agg Report MD","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"# Individual Symptom Trending\\n\\nThis dashboard is meant to help with examine individual servicemember\'s historic symptoms and coronavirus exposure potential. **Warning: The graphs and tables will generally not be useful until a filter for an individual servicemember is added.**\\n\\n#### Time Filter\\n\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 14 days\\".\\n\\n#### Control Board\\n\\nFilter by EDIPI. All sections below will use the time and EDIPI filters.\\n\\n#### Daily Symptoms\\n\\nA table with a row for each date showing the symptoms that the person had each day along with their max score.\\n\\n#### Max Score per Day\\n\\nA visual line graph of the maximum score per day for each person."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5e9273a0-29f3-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Individual Symptom Trending',
        'hits': 0,
        'description': 'Individuals Symptoms Over Time',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"h":15,"i":"1","w":32,"x":0,"y":0},"id":"1fc60b10-292a-11eb-aa43-cf97fefcff0e","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"2","w":16,"x":32,"y":0},"id":"78114120-2855-11eb-8bde-57c4cf572790","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{"vis":{"params":{"sort":{"columnIndex":3,"direction":"desc"}}}},"gridData":{"h":19,"i":"4","w":48,"x":0,"y":15},"id":"aded5c30-2854-11eb-8bde-57c4cf572790","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":19,"i":"5","w":48,"x":0,"y":34},"id":"db29cdc0-2929-11eb-aa43-cf97fefcff0e","panelIndex":"5","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-30d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[{"$state":{"store":"appState"},"meta":{"alias":null,"controlledBy":"1605799680710","disabled":false,"index":"a8de1010-2532-11eb-aa43-cf97fefcff0e","key":"Roster.firstName.keyword","negate":false,"params":{"query":"Brian","type":"phrase"},"type":"phrase","value":"Brian"},"query":{"match":{"Roster.firstName.keyword":{"query":"Brian","type":"phrase"}}}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '55ae0f90-61a9-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom symptom graph text',
        'visState': '{"title":"Health / Symptom symptom graph text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following four graphs below convey the following:\\n\\n#### Symptom Share\\nThe percentage share of symptoms from all observations reporting symptoms in the given time period. Keep in mind that individual observations can have multiple symptoms.\\n#### Condition Share\\nThe percentage share of all conditions from all observations reporting conditions in the given time period. Keep in mind that individual observations can have multiple conditions.\\n#### Servicemember symptom report\\nA table that shows the number of observations received where the individual reported symptoms or conditions.  You may sort by EDIPI or Observations with symptoms or conditions.\\n#### Unit Symptom health\\nA table that shows the number of observations received on a per unit basis where the individual reported symptoms or conditions."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
  ],
  pii: [
    {
      '_id': 'd2f7e8d0-3c98-11eb-aa43-cf97fefcff0e',
      '_type': 'search',
      '_source': {
        'title': 'DAVE - Individuals Mustered',
        'description': '',
        'hits': 0,
        'columns': [
          'Timestamp',
          'Browser.TimeZone',
          'Roster.edipi',
          'Roster.lastReported',
          'Details.Unit',
        ],
        'sort': [
          'Timestamp',
          'desc',
        ],
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a7194d00-2850-11eb-aa43-cf97fefcff0e","highlightAll":true,"version":true,"query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '0aa4c0d0-f44d-11ea-82b7-4bc5055cc562',
      '_type': 'index-pattern',
      '_source': {
        'title': '*',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Age","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Age.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Sp02Percent","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.edipi","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.firstName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.startDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.endDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"EDIPI","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"EDIPI.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"time_since_obs_hours","type":"number","count":0,"scripted":true,"script":"(new Date().getTime() - doc[\'Timestamp\'].value.getMillis()) / 1000 / 60 / 60","lang":"painless","searchable":true,"aggregatable":true,"readFromDocValues":false}]',
        'fieldFormatMap': '{"time_since_obs_hours":{"id":"number"}}',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '0767d120-2367-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': '*-health',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"time_since_obs_hours","type":"number","count":0,"scripted":true,"script":"(new Date().getTime() - doc[\'Timestamp\'].value.getMillis()) / 1000 / 60 / 60","lang":"painless","searchable":true,"aggregatable":true,"readFromDocValues":false}]',
        'fieldFormatMap': '{"time_since_obs_hours":{"id":"number"}}',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '74234ab0-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': '*health',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false}]',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a7194d00-2850-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': '*-reports',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"EDIPI","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"EDIPI.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.durationMinutes","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.endTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.id.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.reported","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTime","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.startTime.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.timezone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.timezone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.advancedParty","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.aircrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.billetWorkcenter","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.billetWorkcenter.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdi","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdqar","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.contractNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.contractNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.covid19TestReturnDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dept","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.dept.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.div","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.div.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dscacrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.edipi","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.edipi.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.endDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.firstName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.firstName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.lastName.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastReported","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.phone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.phone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pilot","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pui","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rate","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rate.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rateRank","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rateRank.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rom.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.romRelease","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.romRelease.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.startDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.traveler_or_contact","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.traveler_or_contact.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.undefined","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.undefined.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"time_since_obs_hours","type":"number","count":0,"scripted":true,"script":"(new Date().getTime() - doc[\'Timestamp\'].value.getMillis()) / 1000 / 60 / 60","lang":"painless","searchable":true,"aggregatable":true,"readFromDocValues":false}]',
        'fieldFormatMap': '{"time_since_obs_hours":{"id":"number"}}',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c9198a80-2514-11eb-aa43-cf97fefcff0e',
      '_type': 'search',
      '_source': {
        'title': 'Alert - User Needs Medical Attention - Base',
        'description': '',
        'hits': 0,
        'columns': [
          'Roster.unit',
          'Category',
          'Details.TemperatureFahrenheit',
          'Details.TalkToSomeone',
          'Score',
        ],
        'sort': [
          'Timestamp',
          'desc',
        ],
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","highlightAll":true,"version":true,"query":{"language":"kuery","query":"(Category.keyword  :  \\"very high\\" ) or (Category.keyword  : \\"high\\" ) or (Category.keyword : \\"medium\\" ) or (Details.TemperatureFahrenheit >= 102) or (Details.TalkToSomeone :  1)"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c3644b10-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Force Health',
        'hits': 0,
        'description': 'Monitoring overall health of the force',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":38,"y":0,"w":10,"h":21,"i":"2"},"id":"40f18f20-229b-11eb-aa43-cf97fefcff0e","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":50,"w":24,"h":12,"i":"3"},"id":"b976ad90-229b-11eb-aa43-cf97fefcff0e","panelIndex":"3","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":78,"w":24,"h":15,"i":"4"},"id":"f4b06bd0-229b-11eb-aa43-cf97fefcff0e","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":14,"y":0,"w":13,"h":21,"i":"5"},"id":"6f708620-229c-11eb-aa43-cf97fefcff0e","panelIndex":"5","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":50,"w":24,"h":12,"i":"6"},"id":"c39b0090-229c-11eb-aa43-cf97fefcff0e","panelIndex":"6","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":78,"w":24,"h":15,"i":"7"},"id":"01bd38c0-229d-11eb-aa43-cf97fefcff0e","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":111,"w":24,"h":19,"i":"8"},"id":"a0eeda70-229d-11eb-aa43-cf97fefcff0e","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":111,"w":24,"h":19,"i":"9"},"id":"1885c850-229e-11eb-aa43-cf97fefcff0e","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":130,"w":24,"h":15,"i":"10"},"id":"57e71030-229e-11eb-aa43-cf97fefcff0e","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":130,"w":24,"h":15,"i":"11"},"id":"7afa6720-229e-11eb-aa43-cf97fefcff0e","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":37,"w":24,"h":13,"i":"12"},"id":"e2e816d0-29e6-11eb-aa43-cf97fefcff0e","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":37,"w":24,"h":13,"i":"13"},"id":"8e685260-2a94-11eb-aa43-cf97fefcff0e","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":62,"w":24,"h":16,"i":"14"},"id":"800b9af0-2a95-11eb-aa43-cf97fefcff0e","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":14,"h":21,"i":"15"},"id":"b5c163d0-61bf-11eb-ab11-f728fb6de5ec","panelIndex":"15","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":27,"y":0,"w":11,"h":21,"i":"16"},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"16","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":21,"w":48,"h":16,"i":"17"},"id":"5902bef0-6250-11eb-ab11-f728fb6de5ec","panelIndex":"17","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":62,"w":24,"h":16,"i":"18"},"id":"9bf611c0-6251-11eb-ab11-f728fb6de5ec","panelIndex":"18","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":93,"w":48,"h":18,"i":"19"},"version":"6.4.1","panelIndex":"19","type":"visualization","id":"a2f3d060-6252-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-14d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e292ffd0-2863-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Alert - Control Board - Base',
        'visState': '{"title":"Alert - Control Board - Base","type":"input_control_vis","params":{"controls":[{"id":"1599843098242","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1599843111344","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605806664606","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Details.Symptoms.keyword","parent":"","label":"Symptoms - Select all that apply (no selection implies all symptoms)","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster List Text',
        'visState': '{"title":"Muster List Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Muster List\\nList of individuals with the last time they submitted an observation.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Soldier Observation Follow-up\\nA table that displays when the last time an individual submitted a symptoms observation report. Each row in the table shows the EDIPI, the individual\'s phone number, name, lodging, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the three columns."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f4558e30-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Coronavirus Health Text',
        'visState': '{"title":"Coronavirus Health Text","type":"markdown","params":{"fontSize":24,"openLinksInNewTab":false,"markdown":"Coronavirus Exposure / Symptoms\\n---"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '6f708620-229c-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Health control board',
        'visState': '{"title":"Health control board","type":"input_control_vis","params":{"controls":[{"id":"1604933946497","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933991588","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933914012","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Details.Symptoms.keyword","parent":"","label":"Symptoms","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933973627","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Details.Conditions.keyword","parent":"","label":"Conditions","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1c7a8120-f446-11ea-82b7-4bc5055cc562',
      '_type': 'dashboard',
      '_source': {
        'title': 'Muster List',
        'hits': 0,
        'description': 'List of individuals with the last time they submitted an observation.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":0,"y":15,"w":48,"h":31,"i":"1"},"id":"bbabdb50-eecd-11ea-aec4-4103718388c0","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":48,"h":15,"i":"2"},"id":"cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1","panelIndex":"2","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-24h',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'afcaefb0-253c-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Symptom Trending',
        'hits': 0,
        'description': 'Trends of Symptoms and Individual Health Categories over time.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":31,"y":0,"w":17,"h":15,"i":"2"},"id":"e292ffd0-2863-11eb-aa43-cf97fefcff0e","panelIndex":"2","title":"Filters","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":31,"h":15,"i":"3"},"id":"179bb360-2865-11eb-aa43-cf97fefcff0e","panelIndex":"3","title":"Dashboard Description","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":30,"w":48,"h":17,"i":"6"},"id":"12409630-29ee-11eb-aa43-cf97fefcff0e","panelIndex":"6","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":15,"w":48,"h":15,"i":"7"},"version":"6.4.1","panelIndex":"7","type":"visualization","id":"15be3790-618e-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-7d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '2f5db6e0-eeba-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Muster Non-Compliance',
        'hits': 0,
        'description': 'A Dashboard for examining muster non-compliance across a cohort',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"h":15,"i":"2","w":8,"x":28,"y":0},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"9","w":13,"x":15,"y":0},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":29,"i":"10","w":15,"x":0,"y":0},"id":"82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"11","w":24,"x":0,"y":44},"id":"bd1983b0-51f7-11eb-b1c2-819d629adfcd","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":14,"i":"12","w":33,"x":15,"y":15},"id":"7fd3b4b0-51ea-11eb-b1c2-819d629adfcd","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"13","w":12,"x":36,"y":0},"id":"0df55b40-51eb-11eb-b1c2-819d629adfcd","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"14","w":24,"x":24,"y":44},"id":"8c85ee40-544b-11eb-b1c2-819d629adfcd","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"15","w":48,"x":0,"y":29},"id":"abab3d40-61a0-11eb-ab11-f728fb6de5ec","panelIndex":"15","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-5y',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e25abde0-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental Health Text',
        'visState': '{"title":"Mental Health Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"Mental Health\\n---\\n\\n#### Control Board\\n\\nControls for selecting unit and lodging filters to be applied to the other visualizations\\n\\n#### Total Individuals\\nThe total number of unique individuals that have submitted observations\\n\\n#### Total Observations\\n\\nThe total number of symptom observations given within the specified time range"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster Compliance Text',
        'visState': '{"title":"Muster Compliance Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Muster Non-Compliance\\nA dashboard supplying various ways of examining muster non-compliance across a cohort.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Individuals\\nThe total number of individuals who reported symptoms.\\n#### Unit Muster Non-Compliance Rate\\nA table of units along with the percentage of times individuals in the unit did not report during muster for the given time period.\\n#### Servicemember Muster Non-Compliance Rate\\nA table of individuals along with the percentage of times that they have not reported during muster for the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Coronavirus At-risk Individuals Follow-Up Text',
        'visState': '{"title":"Coronavirus At-risk Individuals Follow-Up Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Individual needs medical attention\\nList of individuals at high risk of exposure to coronavirus based on their symptom submission.\\n\\"**At-risk**\\" is defined as any individual whose combination of reported symptoms, conditions, and temperature results in a categorization of \\"high\\" or \\"very_high\\" risk of coronavirus exposure in accordance with DDS\'s [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 24 Hours\\".\\n#### Recent Individuals at Risk of COVID-19 Exposure\\nA filtered table that shows the reporting status of only individuals who are deemed at risk for COVID-19 exposure. Each row in the table shows the EDIPI, score, risk exposure by category, date and time of last observation, temperature and the number of hours since the last observation.  You may sort by any of the columns.\\nIf an individual submits symptoms multiple times within the time period, this table displays the most recent data."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'abab3d40-61a0-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster non-compliance graph text',
        'visState': '{"title":"Muster non-compliance graph text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The graphs below provide the following information:\\n\\n#### Daily Muster Non-Compliance\\nA graph showing muster compliance on a daily basis for the given time period and filters. If a very long time period such as years is selected, the graph will aggregate over longer segments of time than a day.\\n\\n#### Muster Timing\\nA multi-line graph showing the general timing of muster reports by individuals.\\n- *Early* - The report was provided **before** the appointed muster time-window.\\n- *Late* - The report was provided **after** the appointed muster time-window.\\n- *On-time* - The report was provided **during** the appointed muster time-window.\\n- *Non-Reporting* - **No report was provided** any time within the vicinity of the muster time-window, defined as the halfway point between the close of one muster reporting time-window and the beginning of another."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '78114120-2855-11eb-8bde-57c4cf572790',
      '_type': 'visualization',
      '_source': {
        'title': 'Medical Health Aggregation Control Board',
        'visState': '{"title":"Medical Health Aggregation Control Board","type":"input_control_vis","params":{"controls":[{"id":"1605563290045","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"EDIPI.keyword","parent":"","label":"EDIPI","type":"list","options":{"type":"terms","multiselect":false,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605799680710","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.firstName.keyword","parent":"","label":"First","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605799712742","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.lastName.keyword","parent":"","label":"Last","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '29154300-4533-11eb-ad41-4d6b4e8c461f',
      '_type': 'visualization',
      '_source': {
        'title': 'Controls - Unit Selector',
        'visState': '{"title":"Controls - Unit Selector","type":"input_control_vis","params":{"controls":[{"id":"1608737092395","indexPattern":"1fe23f40-2440-11eb-aa43-cf97fefcff0e","fieldName":"Details.Unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '179bb360-2865-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom trending - Text - Base',
        'visState': '{"title":"Symptom trending - Text - Base","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Symptom Trending\\nLine chart of symptoms trending over time.\\n\\nLine chart of the count of individuals in their respective categories over time.\\n\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 24 Hours\\".\\n\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n\\n#### Individual Needs Medical Attention Line Chart\\nMulti-line graph where each line and color shows the number of symptoms observations received throughout the time window as specified by the time filter in 12-hour time intervals. Each line and color represents a specific symptom. You may filter out specific symptoms by clicking on the symptom name on the right side of the graph.\\n\\n#### Individuals by Category\\nThis is a multi-line graph depicting the number of observations across all units along with their corresponding \\"category\\" of coronavirus exposure risk based on the reported symptoms and conditions, in accordance with DDS\'s [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator)."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '353451a0-f8e2-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals That Would Like to Talk to Someone Text',
        'visState': '{"title":"Individuals That Would Like to Talk to Someone Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Individuals That Would Like to Talk to Someone\\nList of individuals that indicated they \\"would like to talk someone\\" in their submission\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Talk To Someone Recency Board\\nA table that shows all individuals who want to talk to someone. Each row in the table shows the EDIPI, name, phone, lodging, unit, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the columns."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '18aa2a20-f444-11ea-82b7-4bc5055cc562',
      '_type': 'visualization',
      '_source': {
        'title': 'Control Board',
        'visState': '{"title":"Control Board","type":"input_control_vis","params":{"controls":[{"id":"1599843098242","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1599843111344","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e4dbae10-618c-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental health tables explanation text',
        'visState': '{"title":"Mental health tables explanation text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The tables to the right convey the following information:\\n#### Talk to Someone recency board\\n\\nA list of individuals who have indicated that they would like to talk to someone. Sort this list by the \\"Last Timestamp\\" column to bring the most recent individuals to the top.\\n\\n#### Anxiety / Concern Monitoring\\n\\nA list of individuals along with the total number of times they have asked to talk to someone. A higher number here may indicate a servicemember is in need of mental health attention or increased monitoring"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '89db5d70-618d-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental health graphs explanation',
        'visState': '{"title":"Mental health graphs explanation","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The graphs below provide the following:\\n\\n\\n#### Cohort Anxiety / Concern\\n\\nThe total number of symptom observations indicating a need to talk to someone over time. This should serve as an indicator of overall mental health among a cohort of servicemembers.\\n\\n#### Talk to someone observation share\\n\\nThe total share of observations indicating a need to talk to someone versus those that made no indication. This gives an overall view of mental health of the cohort during the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '09c49db0-e94f-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Data Quality Issues Text',
        'visState': '{"title":"Data Quality Issues Text","type":"markdown","params":{"fontSize":24,"openLinksInNewTab":false,"markdown":"Data Quality / Issues\\n---"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a2f3d060-6252-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health heatmaps text',
        'visState': '{"title":"Force health heatmaps text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following four heat maps provide a breakdown of particular symptom and condition prevalence across units and lodgings. These visualizations can be useful for examining potential \\"hot-spots\\" of symptoms / conditions linked either to units or lodging over the course of a period of time. If the concept of lodging does not make sense for your situation, e.g. you operate on a ship, then you may safely ignore the heatmaps related to lodging:\\n\\n#### Symptom reports by Unit Heatmap\\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-symptom basis.\\n\\n\\n#### Condition reports by Unit Heatmap \\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-condition basis.\\n\\n#### Symptom reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-symptom basis.\\n\\n#### Condition reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-condition basis."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '308b9ce0-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Condition Share',
        'visState': '{"title":"Condition Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1fc60b10-292a-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Med Health Agg Report MD',
        'visState': '{"title":"Med Health Agg Report MD","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"# Individual Symptom Trending\\n\\nThis dashboard is meant to help with examine individual servicemember\'s historic symptoms and coronavirus exposure potential. **Warning: The graphs and tables will generally not be useful until a filter for an individual servicemember is added.**\\n\\n#### Time Filter\\n\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 14 days\\".\\n\\n#### Control Board\\n\\nFilter by EDIPI. All sections below will use the time and EDIPI filters.\\n\\n#### Daily Symptoms\\n\\nA table with a row for each date showing the symptoms that the person had each day along with their max score.\\n\\n#### Max Score per Day\\n\\nA visual line graph of the maximum score per day for each person."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '496c5380-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom Share',
        'visState': '{"title":"Symptom Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '91ed9950-eecf-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations over time by Lodging',
        'visState': '{"title":"Observations over time by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '800b9af0-2a95-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'At-risk individuals by Unit',
        'visState': '{"title":"At-risk individuals by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"should":[{"terms":{"Category.keyword":["very high","high"]}},{"bool":{"must":[{"term":{"Category.keyword":"medium"}},{"range":{"Details.TemperatureFahrenheit":{"gte":102}}}]}}]}},"meta":{"negate":false,"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","disabled":false,"alias":"v. high, high, or (medium and temp >= 102)","type":"custom","key":"query","value":"{\\"bool\\":{\\"should\\":[{\\"terms\\":{\\"Category.keyword\\":[\\"very high\\",\\"high\\"]}},{\\"bool\\":{\\"must\\":[{\\"term\\":{\\"Category.keyword\\":\\"medium\\"}},{\\"range\\":{\\"Details.TemperatureFahrenheit\\":{\\"gte\\":102}}}]}}]}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '57e71030-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom reports by Lodging',
        'visState': '{"title":"Symptom reports by Lodging","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":49997,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Symptoms"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Lodging"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 12":"rgb(247,252,245)","12 - 23":"rgb(199,233,192)","23 - 34":"rgb(116,196,118)","34 - 45":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '0df55b40-51eb-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Unit Muster Non-Compliance rate',
        'visState': '{"title":"Unit Muster Non-Compliance rate","type":"enhanced-table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum","computedColumns":[{"label":"Muster non-compliance rate","formula":"col2 / col1","format":"number","pattern":"0,0%","alignment":"left","applyAlignmentOnTitle":true,"applyAlignmentOnTotal":true,"applyTemplate":false,"applyTemplateOnTotal":true,"template":"{{value}}","enabled":true}],"computedColsPerSplitCol":false,"hideExportLinks":false,"showFilterBar":false,"filterCaseSensitive":false,"filterBarHideable":false,"filterAsYouType":false,"filterTermsSeparately":false,"filterHighlightResults":false,"filterBarWidth":"25%","hiddenColumns":"1,2"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"2","enabled":true,"type":"filters","schema":"splitcols","params":{"filters":[{"input":{"query":"*"},"label":""},{"input":{"query":"Muster.reported: false"}}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bd1983b0-51f7-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Daily Muster Non-Compliance',
        'visState': '{"title":"Daily Muster Non-Compliance","type":"area","params":{"type":"area","grid":{"categoryLines":false,"style":{"color":"#eee"},"valueAxis":null},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"percentage","defaultYExtents":false},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Percentage"}}],"seriesParams":[{"show":"true","type":"area","mode":"stacked","data":{"label":"Count","id":"1"},"drawLinesBetweenPoints":true,"showCircles":true,"interpolate":"linear","valueAxis":"ValueAxis-1"}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"filters","schema":"group","params":{"filters":[{"input":{"query":"Muster.reported: false"},"label":"Number NOT reporting"},{"input":{"query":"Muster.reported: true"},"label":"Number Reporting"}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"colors":{"Number NOT reporting":"#E24D42","Number Reporting":"#BADFF4"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom Tracking Text',
        'visState': '{"title":"Health / Symptom Tracking Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Health / Symptom Tracking\\nA dashboard for tracking servicemember symptoms and coronavirus exposure potential\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of symptoms observations. \\n#### Total Individuals\\nThe total number of individuals who reported symptoms."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b79376a0-61bd-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom lodging text',
        'visState': '{"title":"Health / Symptom lodging text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following graphs below all provide information related to health and symptoms across lodging. **If such a variable does not make sense for your situation, e.g. you operate on a ship, then you can safely ignore these graphs**. They provide the following information:\\n\\n#### Cohort Symptom and Condition Prevalence by Lodging\\nProvides the average risk score of observations by lodging\\n\\n#### Cohort At-risk Individual Count by Lodging\\nProvides the number of at-risk observations per lodging.  An \\"at-risk\\" observation is one in which the risk category is \\"high\\" or \\"very high\\" as determined by the DDS coronavirus calculator.\\n\\n#### Symptom Prevalence by Lodging\\nA graph providing the number of observations containing given symptoms by lodging. Note that symptoms are provided as a list. A single observation may have multiple concurrent symptoms.\\n\\n#### Condition Prevalence by Lodging\\nA graph providing the number of observations containing given conditions by lodging. Note that conditions are provided as a list. A single observation may have multiple concurrent symptoms."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b5c163d0-61bf-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force Health Dashboard Intro text',
        'visState': '{"title":"Force Health Dashboard Intro text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"# Force Health Dashboard\\nThis dashboard provides a number of visualizations related to examining and exploring force health.\\n\\n#### Health Control Board\\nA set of controls for setting filters on unit, lodging, symptoms, or conditions. Choose apply changes to change the filters.\\n\\n#### Total Individuals\\nThe total number of individuals making up the cohort under examination.\\n\\n#### Total Units\\nThe total number of units represented by individuals making up the cohort under examination."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5902bef0-6250-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health risk symptom text',
        'visState': '{"title":"Force health risk symptom text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The four graphs below convey the following:\\n\\n#### Average Risk Score\\nThe average risk score of the cohort for the given time period. For individual observations, a score of 40 or higher would be classified as \'high\' risk, and a score of \'70\' or higher would be classified as \'very high\' risk.\\n\\n#### Individuals per Risk Category\\nA line graph providing the number of observations belonging to each category of coronavirus exposure risk as determined according to [DDS\'s coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Symptom Tracking\\nThe numbers of given symptoms reported in a particular time period. Note that single observations can contain multiple symptoms.\\n\\n#### Condition Tracking\\nThe numbers of given conditions reported in a particular time period. Note that single observations can contain multiple conditions."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cb8f07b0-61b7-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptoms risk explanation',
        'visState': '{"title":"Health / Symptoms risk explanation","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The two graphs on the right convey concepts related to individuals\' risk of coronavirus exposure. Details of the  used to produce Documentation for the scores and categories used by these graphs can be found in the [DDS created coronavirus calculator](https://github.com/deptofdefense/covid19-calculator). The graphs convey the following:\\n\\n#### Cohort Symptom and Condition prevalence\\nA line graph conveying the average coronavirus risk score of the cohort over the specified time period. For an individual report, a risk score over 40 would be considered \'high\' and a risk score over 70 would be considered \'very high\'.\\n\\n#### Cohort Coronavirus Risk\\nA multi-line graph providing counts of observations by coronavirus risk category, as defined by DDS\'s coronavirus risk calculator, over the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '9bf611c0-6251-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health unit summary graphs text',
        'visState': '{"title":"Force health unit summary graphs text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The following three graphs below and to the right provide risk metrics on a per unit basis:\\n\\n#### At-risk Individuals by Unit\\nThe total number of observations that are \'at-risk\' from a given unit over a given time period. An \'at-risk\' observation is one that is classified as \'high\' or \'very high\' risk by the [DDS coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Total Symptoms reported by Unit\\nThe total number of observations containing symptoms coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\\n\\n#### Total Conditions reported by Unit\\nThe total number of observations containing conditions coming from a given unit. This should show whether some units are being harder hit than others by illnesses."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e2e816d0-29e6-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals Per Risk Category',
        'visState': '{"title":"Individuals Per Risk Category","type":"line","params":{"addLegend":true,"addTimeMarker":false,"addTooltip":true,"categoryAxes":[{"id":"CategoryAxis-1","labels":{"show":true,"truncate":100},"position":"bottom","scale":{"type":"linear"},"show":true,"style":{},"title":{},"type":"category"}],"grid":{"categoryLines":false,"style":{"color":"#eee"}},"legendPosition":"right","seriesParams":[{"data":{"id":"1","label":"Count"},"drawLinesBetweenPoints":true,"mode":"normal","show":"true","showCircles":true,"type":"line","valueAxis":"ValueAxis-1"}],"times":[],"type":"line","valueAxes":[{"id":"ValueAxis-1","labels":{"filter":false,"rotate":0,"show":true,"truncate":100},"name":"LeftAxis-1","position":"left","scale":{"mode":"normal","type":"linear"},"show":true,"style":{},"title":{"text":"Count"},"type":"value"}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f4b06bd0-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total symptoms reported by Unit',
        'visState': '{"title":"Total symptoms reported by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Total symptoms reported"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Total symptoms reported","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total symptoms reported"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c39b0090-229c-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions tracking',
        'visState': '{"title":"Conditions tracking","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a0eeda70-229d-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom reports by Unit Heatmap',
        'visState': '{"title":"Symptom reports by Unit Heatmap","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 65":"rgb(247,252,245)","65 - 130":"rgb(199,233,192)","130 - 195":"rgb(116,196,118)","195 - 260":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '8e685260-2a94-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Average Risk Score',
        'visState': '{"title":"Average Risk Score","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Risk Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Risk Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score","customLabel":"Average Risk Score"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '12409630-29ee-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals by Category',
        'visState': '{"title":"Individuals by Category","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'd3be0d70-eec4-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom prevalence by Lodging',
        'visState': '{"title":"Symptom prevalence by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"4","enabled":true,"type":"terms","schema":"split","params":{"field":"Details.Lodging.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","row":true}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '4fef2150-e93d-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort coronavirus risk',
        'visState': '{"title":"Cohort coronavirus risk","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '783c2c90-eecc-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Symptom and Condition Prevalence by Lodging',
        'visState': '{"title":"Cohort Symptom and Condition Prevalence by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5c298f90-eecf-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Talk to someone Observation Share',
        'visState': '{"title":"Talk to someone Observation Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.TalkToSomeone","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'ebe2c2e0-eecb-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions prevalence by Lodging',
        'visState': '{"title":"Conditions prevalence by Lodging","type":"line","params":{"addLegend":true,"addTimeMarker":false,"addTooltip":true,"categoryAxes":[{"id":"CategoryAxis-1","labels":{"show":true,"truncate":100},"position":"bottom","scale":{"type":"linear"},"show":true,"style":{},"title":{},"type":"category"}],"grid":{"categoryLines":false,"style":{"color":"#eee"}},"legendPosition":"right","seriesParams":[{"data":{"id":"1","label":"Count"},"drawLinesBetweenPoints":true,"mode":"normal","show":"true","showCircles":true,"type":"line","valueAxis":"ValueAxis-1"}],"times":[],"type":"line","valueAxes":[{"id":"ValueAxis-1","labels":{"filter":false,"rotate":0,"show":true,"truncate":100},"name":"LeftAxis-1","position":"left","scale":{"mode":"normal","type":"linear"},"show":true,"style":{},"title":{"text":"Count"},"type":"value"}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Conditions.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"4","enabled":true,"type":"terms","schema":"split","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","row":true}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '354112d0-e93f-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Symptom and Condition Prevalence',
        'visState': '{"title":"Cohort Symptom and Condition Prevalence","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7afa6720-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions by Lodging',
        'visState': '{"title":"Conditions by Lodging","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Conditions"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Lodging"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 12":"rgb(247,252,245)","12 - 23":"rgb(199,233,192)","23 - 34":"rgb(116,196,118)","34 - 45":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e201d150-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Observations',
        'visState': '{"title":"Total Observations","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c95255a0-e93b-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Anxiety / Concern',
        'visState': '{"title":"Cohort Anxiety / Concern","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Sum of Details.TalkToSomeone"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Sum of Details.TalkToSomeone","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"sum","schema":"metric","params":{"field":"Details.TalkToSomeone"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '9d2f98b0-eecd-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations by Time',
        'visState': '{"title":"Observations by Time","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1885c850-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Condition reports by Unit Heatmap',
        'visState': '{"title":"Condition reports by Unit Heatmap","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 50":"rgb(247,252,245)","50 - 100":"rgb(199,233,192)","100 - 150":"rgb(116,196,118)","150 - 200":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '40f18f20-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Units',
        'visState': '{"title":"Total Units","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"cardinality","schema":"metric","params":{"field":"_index","customLabel":"Total Units"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b976ad90-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom tracking',
        'visState': '{"title":"Symptom tracking","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Number reporting given symptom"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Number reporting given symptom","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Number reporting given symptom"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{},"customLabel":""},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'dd03d8d0-e94a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Observations',
        'visState': '{"title":"Total Observations","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total Observations"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c8f9d790-e94a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Individuals',
        'visState': '{"title":"Total Individuals","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"cardinality","schema":"metric","params":{"field":"EDIPI.keyword","customLabel":"Persons"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a7194d00-2850-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bf289fd0-61a9-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Unit Symptom Health',
        'visState': '{"title":"Unit Symptom Health","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Observations with symptoms or conditions"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"filter":{"bool":{"should":[{"exists":{"field":"Details.Symptoms.keyword"}},{"exists":{"field":"Details.Conditions.keyword"}}]}}}},"meta":{"negate":false,"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","disabled":false,"alias":"Conditions OR Symptoms Exist","type":"custom","key":"query","value":"{\\"bool\\":{\\"filter\\":{\\"bool\\":{\\"should\\":[{\\"exists\\":{\\"field\\":\\"Details.Symptoms.keyword\\"}},{\\"exists\\":{\\"field\\":\\"Details.Conditions.keyword\\"}}]}}}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '01bd38c0-229d-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Conditions reported by Unit',
        'visState': '{"title":"Total Conditions reported by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Total conditions reported"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Total conditions reported","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total conditions reported"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bbabdb50-eecd-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Soldier Observation follow-up',
        'visState': '{"title":"Soldier Observation follow-up","type":"table","params":{"perPage":20,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":2,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"Timestamp","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Date Time of Last Observation"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":5000,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"top_hits","schema":"metric","params":{"field":"time_since_obs_hours","aggregate":"concat","size":1,"sortField":"Timestamp","sortOrder":"desc","customLabel":"Hours Since Last Observation"},"hidden":false},{"id":"4","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Details.PhoneNumber.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Phone"},"hidden":false},{"id":"7","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":5,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":2,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a7194d00-2850-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '15be3790-618e-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom Trending Line Graph',
        'visState': '{"title":"Symptom Trending Line Graph","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '8c85ee40-544b-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster timing',
        'visState': '{"title":"Muster timing","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Muster.status.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a7194d00-2850-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7fd3b4b0-51ea-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Servicemember Muster Non-Compliance Rate',
        'visState': '{"title":"Servicemember Muster Non-Compliance Rate","type":"enhanced-table","params":{"computedColsPerSplitCol":false,"computedColumns":[{"label":"Muster non-compliance rate","formula":"col5 / col4","format":"number","pattern":"0,0%","alignment":"left","applyAlignmentOnTitle":true,"applyAlignmentOnTotal":true,"applyTemplate":false,"applyTemplateOnTotal":true,"template":"{{value}}","enabled":true}],"filterAsYouType":false,"filterBarHideable":false,"filterBarWidth":"25%","filterCaseSensitive":false,"filterHighlightResults":false,"filterTermsSeparately":false,"hideExportLinks":false,"perPage":10,"showFilterBar":false,"showMetricsAtAllLevels":false,"showPartialRows":false,"showTotal":false,"sort":{"columnIndex":null,"direction":null},"totalFunc":"sum","hiddenColumns":"4,5"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"4","enabled":true,"type":"terms","schema":"bucket","params":{"field":"EDIPI.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"EDIPI"},"hidden":false},{"id":"5","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.firstName.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"First Name"},"hidden":false},{"id":"6","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.lastName.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Last Name"},"hidden":false},{"id":"7","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.phone.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"filters","schema":"splitcols","params":{"filters":[{"input":{"query":"*"},"label":""},{"input":{"query":"Muster.reported: false"}}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"a7194d00-2850-11eb-aa43-cf97fefcff0e","query":{"language":"kuery","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f1a95bb0-eeb9-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Mental Health',
        'hits': 0,
        'description': 'A dashboard for relevantly tracking the "Talk to someone" field from service member submissions.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":25,"y":0,"w":11,"h":17,"i":"2"},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":36,"y":0,"w":12,"h":17,"i":"3"},"id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","panelIndex":"3","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":16,"y":27,"w":32,"h":14,"i":"4"},"id":"c95255a0-e93b-11ea-b481-91d592e28f0d","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":27,"w":16,"h":14,"i":"7"},"id":"5c298f90-eecf-11ea-aec4-4103718388c0","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":12,"y":0,"w":13,"h":17,"i":"8"},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":12,"h":17,"i":"9"},"id":"e25abde0-e94e-11ea-b481-91d592e28f0d","panelIndex":"9","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":17,"w":48,"h":10,"i":"12"},"version":"6.4.1","panelIndex":"12","type":"visualization","id":"89db5d70-618d-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-14d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '55ae0f90-61a9-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom symptom graph text',
        'visState': '{"title":"Health / Symptom symptom graph text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following three graphs below and to the right convey the following:\\n\\n#### Symptom Share\\nThe percentage share of symptoms from all observations reporting symptoms in the given time period. Keep in mind that individual observations can have multiple symptoms.\\n#### Condition Share\\nThe percentage share of all conditions from all observations reporting conditions in the given time period. Keep in mind that individual observations can have multiple conditions.\\n#### Unit Symptom health\\nA table that shows the number of observations received on a per unit basis where the individual reported symptoms or conditions."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c539a380-6265-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort At-risk Individual Count by Lodging',
        'visState': '{"title":"Cohort At-risk Individual Count by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"meta":{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","type":"phrases","key":"Category.keyword","value":"high, very high","params":["high","very high"],"negate":false,"disabled":false,"alias":null},"query":{"bool":{"should":[{"match_phrase":{"Category.keyword":"high"}},{"match_phrase":{"Category.keyword":"very high"}}],"minimum_should_match":1}},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '061fb350-eeba-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Health / Symptom Tracking',
        'hits': 0,
        'description': 'A dashboard for tracking soldier symptoms and coronavirus exposure potential',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"h":12,"i":"1","w":34,"x":14,"y":63},"id":"4fef2150-e93d-11ea-b481-91d592e28f0d","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":12,"i":"2","w":34,"x":14,"y":51},"id":"354112d0-e93f-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":8,"i":"4","w":27,"x":21,"y":12},"id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":12,"i":"6","w":13,"x":35,"y":0},"id":"c8f9d790-e94a-11ea-b481-91d592e28f0d","panelIndex":"6","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":46,"i":"8","w":24,"x":0,"y":107},"id":"d3be0d70-eec4-11ea-aec4-4103718388c0","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":46,"i":"9","w":24,"x":24,"y":107},"id":"ebe2c2e0-eecb-11ea-aec4-4103718388c0","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"10","w":24,"x":0,"y":92},"id":"783c2c90-eecc-11ea-aec4-4103718388c0","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"12","w":24,"x":24,"y":36},"id":"308b9ce0-e946-11ea-b481-91d592e28f0d","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"13","w":24,"x":0,"y":36},"id":"496c5380-e946-11ea-b481-91d592e28f0d","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":12,"i":"14","w":14,"x":21,"y":0},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":20,"i":"15","w":21,"x":0,"y":0},"id":"1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1","panelIndex":"15","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":16,"i":"16","w":24,"x":0,"y":20},"id":"55ae0f90-61a9-11eb-ab11-f728fb6de5ec","panelIndex":"16","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":16,"i":"17","w":24,"x":24,"y":20},"id":"bf289fd0-61a9-11eb-ab11-f728fb6de5ec","panelIndex":"17","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":24,"i":"18","w":14,"x":0,"y":51},"id":"cb8f07b0-61b7-11eb-ab11-f728fb6de5ec","panelIndex":"18","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":17,"i":"20","w":48,"x":0,"y":75},"id":"b79376a0-61bd-11eb-ab11-f728fb6de5ec","panelIndex":"20","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":15,"i":"21","w":24,"x":24,"y":92},"id":"c539a380-6265-11eb-ab11-f728fb6de5ec","panelIndex":"21","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-7d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
  ],
  nonPii: [
    {
      '_id': '74234ab0-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'index-pattern',
      '_source': {
        'title': '*health',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"EDIPI","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"EDIPI.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.durationMinutes","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.endTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.id.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.reported","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTime","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.startTime.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.startTimestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Muster.timezone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Muster.timezone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Disposition","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Disposition.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Provider Notes","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Provider Notes.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.Testing Status","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.Testing Status.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.in_rom","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom_end","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom_start","type":"conflict","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false,"conflictDescriptions":{"date":["testgroup1-airhawk-base-es6ddssymptomobs-health","testgroup1-black_death-base-es6ddssymptomobs-health","testgroup1-bloody_bucket-base-es6ddssymptomobs-health","testgroup1-devils_in_baggy_pants-base-es6ddssymptomobs-health","testgroup1-example_text-base-es6ddssymptomobs-health","testgroup1-grey_ghost-base-es6ddssymptomobs-health","testgroup1-phantom-base-es6ddssymptomobs-health","testgroup1-steel_rain-base-es6ddssymptomobs-health"],"text":["testgroup1-blue_ghost-base-es6ddssymptomobs-health"]}},{"name":"Roster.rom_start.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.undefined","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.undefined.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false}]',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '0aa4c0d0-f44d-11ea-82b7-4bc5055cc562',
      '_type': 'index-pattern',
      '_source': {
        'title': '*',
        'timeFieldName': 'Timestamp',
        'fields': '[{"name":"API.Stage","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"API.Stage.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Browser.TimeZone","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Browser.TimeZone.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Category","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Category.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Application","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Application.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Environment","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Environment.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.GitCommit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.GitCommit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Client.Origin","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Client.Origin.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Conditions","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Conditions.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Confirmed","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Lodging","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Lodging.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.PhoneNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.PhoneNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Symptoms","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Symptoms.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TalkToSomeone","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.TemperatureFahrenheit","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Details.Unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Details.Unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"ID","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"ID.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Model.Version","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Model.Version.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.advancedParty","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.aircrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.billetWorkcenter","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.billetWorkcenter.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdi","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.cdqar","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.contractNumber","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.contractNumber.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.covid19TestReturnDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.dscacrew","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.edipi","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.edipi.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.endDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.lastReported","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pilot","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.pui","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rateRank","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rateRank.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.rom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.rom.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.romRelease","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.romRelease.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.startDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Roster.unit","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"Roster.unit.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Score","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"Timestamp","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_id","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","type":"number","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_source","type":"_source","count":0,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"config.buildNum","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"config.defaultIndex","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"config.defaultIndex.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"config.telemetry:optIn","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.hits","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.optionsJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.panelsJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.refreshInterval.display","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.refreshInterval.pause","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.refreshInterval.section","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.refreshInterval.value","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.timeFrom","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.timeRestore","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.timeTo","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"dashboard.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.uiStateJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"dashboard.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.fieldFormatMap","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"index-pattern.fields","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"index-pattern.intervalName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.notExpandable","type":"boolean","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.sourceFilters","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"index-pattern.timeFieldName","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"index-pattern.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.columns","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"search.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.hits","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"search.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.sort","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"search.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"search.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"server.uuid","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.hits","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.timelion_chart_height","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_columns","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_interval","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_other_interval","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_rows","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"timelion-sheet.timelion_sheet","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"timelion-sheet.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"type","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"updated_at","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.accessCount","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.accessDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.createDate","type":"date","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"url.url","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"url.url.keyword","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"visualization.description","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.kibanaSavedObjectMeta.searchSourceJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.savedSearchId","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"visualization.title","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.uiStateJSON","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"visualization.version","type":"number","count":0,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"visualization.visState","type":"string","count":0,"scripted":false,"searchable":true,"aggregatable":false,"readFromDocValues":false},{"name":"time_since_obs_hours","type":"number","count":0,"scripted":true,"script":"(new Date().getTime() - doc[\'Timestamp\'].value.getMillis()) / 1000 / 60 / 60","lang":"painless","searchable":true,"aggregatable":true,"readFromDocValues":false}]',
        'fieldFormatMap': '{"time_since_obs_hours":{"id":"number"}}',
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c9198a80-2514-11eb-aa43-cf97fefcff0e',
      '_type': 'search',
      '_source': {
        'title': 'Alert - User Needs Medical Attention - Base',
        'description': '',
        'hits': 0,
        'columns': [
          'Roster.unit',
          'Category',
          'Details.TemperatureFahrenheit',
          'Details.TalkToSomeone',
          'Score',
        ],
        'sort': [
          'Timestamp',
          'desc',
        ],
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","highlightAll":true,"version":true,"query":{"language":"kuery","query":"(Category.keyword  :  \\"very high\\" ) or (Category.keyword  : \\"high\\" ) or (Category.keyword : \\"medium\\" ) or (Details.TemperatureFahrenheit >= 102) or (Details.TalkToSomeone :  1)"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'afcaefb0-253c-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Symptom Trending',
        'hits': 0,
        'description': 'Trends of Symptoms and Individual Health Categories over time.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":31,"y":0,"w":17,"h":15,"i":"2"},"id":"e292ffd0-2863-11eb-aa43-cf97fefcff0e","panelIndex":"2","title":"Filters","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":31,"h":15,"i":"3"},"id":"179bb360-2865-11eb-aa43-cf97fefcff0e","panelIndex":"3","title":"Dashboard Description","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":30,"w":48,"h":17,"i":"6"},"id":"12409630-29ee-11eb-aa43-cf97fefcff0e","panelIndex":"6","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":15,"w":48,"h":15,"i":"7"},"version":"6.4.1","panelIndex":"7","type":"visualization","id":"15be3790-618e-11eb-ab11-f728fb6de5ec","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-7d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f4558e30-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Coronavirus Health Text',
        'visState': '{"title":"Coronavirus Health Text","type":"markdown","params":{"fontSize":24,"openLinksInNewTab":false,"markdown":"Coronavirus Exposure / Symptoms\\n---"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster List Text',
        'visState': '{"title":"Muster List Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Muster List\\nList of individuals with the last time they submitted an observation.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Soldier Observation Follow-up\\nA table that displays when the last time an individual submitted a symptoms observation report. Each row in the table shows the EDIPI, the individual\'s phone number, name, lodging, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the three columns."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5902bef0-6250-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health risk symptom text',
        'visState': '{"title":"Force health risk symptom text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The four graphs below convey the following:\\n\\n#### Average Risk Score\\nThe average risk score of the cohort for the given time period. For individual observations, a score of 40 or higher would be classified as \'high\' risk, and a score of \'70\' or higher would be classified as \'very high\' risk.\\n\\n#### Individuals per Risk Category\\nA line graph providing the number of observations belonging to each category of coronavirus exposure risk as determined according to [DDS\'s coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Symptom Tracking\\nThe numbers of given symptoms reported in a particular time period. Note that single observations can contain multiple symptoms.\\n\\n#### Condition Tracking\\nThe numbers of given conditions reported in a particular time period. Note that single observations can contain multiple conditions."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '9bf611c0-6251-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health unit summary graphs text',
        'visState': '{"title":"Force health unit summary graphs text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The following three graphs below and to the right provide risk metrics on a per unit basis:\\n\\n#### At-risk Individuals by Unit\\nThe total number of observations that are \'at-risk\' from a given unit over a given time period. An \'at-risk\' observation is one that is classified as \'high\' or \'very high\' risk by the [DDS coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Total Symptoms reported by Unit\\nThe total number of observations containing symptoms coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\\n\\n#### Total Conditions reported by Unit\\nThe total number of observations containing conditions coming from a given unit. This should show whether some units are being harder hit than others by illnesses."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'cb8f07b0-61b7-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptoms risk explanation',
        'visState': '{"title":"Health / Symptoms risk explanation","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"The two graphs on the right convey concepts related to individuals\' risk of coronavirus exposure. Details of the  used to produce Documentation for the scores and categories used by these graphs can be found in the [DDS created coronavirus calculator](https://github.com/deptofdefense/covid19-calculator). The graphs convey the following:\\n\\n#### Cohort Symptom and Condition prevalence\\nA line graph conveying the average coronavirus risk score of the cohort over the specified time period. For an individual report, a risk score over 40 would be considered \'high\' and a risk score over 70 would be considered \'very high\'.\\n\\n#### Cohort Coronavirus Risk\\nA multi-line graph providing counts of observations by coronavirus risk category, as defined by DDS\'s coronavirus risk calculator, over the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'abab3d40-61a0-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster non-compliance graph text',
        'visState': '{"title":"Muster non-compliance graph text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The graphs below provide the following information:\\n\\n#### Daily Muster Non-Compliance\\nA graph showing muster compliance on a daily basis for the given time period and filters. If a very long time period such as years is selected, the graph will aggregate over longer segments of time than a day.\\n\\n#### Muster Timing\\nA multi-line graph showing the general timing of muster reports by individuals.\\n- *Early* - The report was provided **before** the appointed muster time-window.\\n- *Late* - The report was provided **after** the appointed muster time-window.\\n- *On-time* - The report was provided **during** the appointed muster time-window.\\n- *Non-Reporting* - **No report was provided** any time within the vicinity of the muster time-window, defined as the halfway point between the close of one muster reporting time-window and the beginning of another."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '353451a0-f8e2-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals That Would Like to Talk to Someone Text',
        'visState': '{"title":"Individuals That Would Like to Talk to Someone Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Individuals That Would Like to Talk to Someone\\nList of individuals that indicated they \\"would like to talk someone\\" in their submission\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Talk To Someone Recency Board\\nA table that shows all individuals who want to talk to someone. Each row in the table shows the EDIPI, name, phone, lodging, unit, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the columns."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '179bb360-2865-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom trending - Text - Base',
        'visState': '{"title":"Symptom trending - Text - Base","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Symptom Trending\\nLine chart of symptoms trending over time.\\n\\nLine chart of the count of individuals in their respective categories over time.\\n\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 24 Hours\\".\\n\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n\\n#### Individual Needs Medical Attention Line Chart\\nMulti-line graph where each line and color shows the number of symptoms observations received throughout the time window as specified by the time filter in 12-hour time intervals. Each line and color represents a specific symptom. You may filter out specific symptoms by clicking on the symptom name on the right side of the graph.\\n\\n#### Individuals by Category\\nThis is a multi-line graph depicting the number of observations across all units along with their corresponding \\"category\\" of coronavirus exposure risk based on the reported symptoms and conditions, in accordance with DDS\'s [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator)."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Coronavirus At-risk Individuals Follow-Up Text',
        'visState': '{"title":"Coronavirus At-risk Individuals Follow-Up Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Individual needs medical attention\\nList of individuals at high risk of exposure to coronavirus based on their symptom submission.\\n\\"**At-risk**\\" is defined as any individual whose combination of reported symptoms, conditions, and temperature results in a categorization of \\"high\\" or \\"very_high\\" risk of coronavirus exposure in accordance with DDS\'s [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 24 Hours\\".\\n#### Recent Individuals at Risk of COVID-19 Exposure\\nA filtered table that shows the reporting status of only individuals who are deemed at risk for COVID-19 exposure. Each row in the table shows the EDIPI, score, risk exposure by category, date and time of last observation, temperature and the number of hours since the last observation.  You may sort by any of the columns.\\nIf an individual submits symptoms multiple times within the time period, this table displays the most recent data."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '29154300-4533-11eb-ad41-4d6b4e8c461f',
      '_type': 'visualization',
      '_source': {
        'title': 'Controls - Unit Selector',
        'visState': '{"title":"Controls - Unit Selector","type":"input_control_vis","params":{"controls":[{"id":"1608737092395","indexPattern":"1fe23f40-2440-11eb-aa43-cf97fefcff0e","fieldName":"Details.Unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '78114120-2855-11eb-8bde-57c4cf572790',
      '_type': 'visualization',
      '_source': {
        'title': 'Medical Health Aggregation Control Board',
        'visState': '{"title":"Medical Health Aggregation Control Board","type":"input_control_vis","params":{"controls":[{"id":"1605563290045","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"EDIPI.keyword","parent":"","label":"EDIPI","type":"list","options":{"type":"terms","multiselect":false,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605799680710","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.firstName.keyword","parent":"","label":"First","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605799712742","indexPattern":"0767d120-2367-11eb-aa43-cf97fefcff0e","fieldName":"Roster.lastName.keyword","parent":"","label":"Last","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e4dbae10-618c-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental health tables explanation text',
        'visState': '{"title":"Mental health tables explanation text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The tables to the right convey the following information:\\n#### Talk to Someone recency board\\n\\nA list of individuals who have indicated that they would like to talk to someone. Sort this list by the \\"Last Timestamp\\" column to bring the most recent individuals to the top.\\n\\n#### Anxiety / Concern Monitoring\\n\\nA list of individuals along with the total number of times they have asked to talk to someone. A higher number here may indicate a servicemember is in need of mental health attention or increased monitoring"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a2f3d060-6252-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force health heatmaps text',
        'visState': '{"title":"Force health heatmaps text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following four heat maps provide a breakdown of particular symptom and condition prevalence across units and lodgings. These visualizations can be useful for examining potential \\"hot-spots\\" of symptoms / conditions linked either to units or lodging over the course of a period of time. If the concept of lodging does not make sense for your situation, e.g. you operate on a ship, then you may safely ignore the heatmaps related to lodging:\\n\\n#### Symptom reports by Unit Heatmap\\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-symptom basis.\\n\\n\\n#### Condition reports by Unit Heatmap \\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-condition basis.\\n\\n#### Symptom reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-symptom basis.\\n\\n#### Condition reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-condition basis."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1fc60b10-292a-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Med Health Agg Report MD',
        'visState': '{"title":"Med Health Agg Report MD","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"# Individual Symptom Trending\\n\\nThis dashboard is meant to help with examine individual servicemember\'s historic symptoms and coronavirus exposure potential. **Warning: The graphs and tables will generally not be useful until a filter for an individual servicemember is added.**\\n\\n#### Time Filter\\n\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 14 days\\".\\n\\n#### Control Board\\n\\nFilter by EDIPI. All sections below will use the time and EDIPI filters.\\n\\n#### Daily Symptoms\\n\\nA table with a row for each date showing the symptoms that the person had each day along with their max score.\\n\\n#### Max Score per Day\\n\\nA visual line graph of the maximum score per day for each person."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '89db5d70-618d-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental health graphs explanation',
        'visState': '{"title":"Mental health graphs explanation","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The graphs below provide the following:\\n\\n\\n#### Cohort Anxiety / Concern\\n\\nThe total number of symptom observations indicating a need to talk to someone over time. This should serve as an indicator of overall mental health among a cohort of servicemembers.\\n\\n#### Talk to someone observation share\\n\\nThe total share of observations indicating a need to talk to someone versus those that made no indication. This gives an overall view of mental health of the cohort during the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b79376a0-61bd-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom lodging text',
        'visState': '{"title":"Health / Symptom lodging text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following graphs below all provide information related to health and symptoms across lodging. **If such a variable does not make sense for your situation, e.g. you operate on a ship, then you can safely ignore these graphs**. They provide the following information:\\n\\n#### Cohort Symptom and Condition Prevalence by Lodging\\nProvides the average risk score of observations by lodging\\n\\n#### Cohort At-risk Individual Count by Lodging\\nProvides the number of at-risk observations per lodging.  An \\"at-risk\\" observation is one in which the risk category is \\"high\\" or \\"very high\\" as determined by the DDS coronavirus calculator.\\n\\n#### Symptom Prevalence by Lodging\\nA graph providing the number of observations containing given symptoms by lodging. Note that symptoms are provided as a list. A single observation may have multiple concurrent symptoms.\\n\\n#### Condition Prevalence by Lodging\\nA graph providing the number of observations containing given conditions by lodging. Note that conditions are provided as a list. A single observation may have multiple concurrent symptoms."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '55ae0f90-61a9-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom symptom graph text',
        'visState': '{"title":"Health / Symptom symptom graph text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"The following three graphs below and to the right convey the following:\\n\\n#### Symptom Share\\nThe percentage share of symptoms from all observations reporting symptoms in the given time period. Keep in mind that individual observations can have multiple symptoms.\\n#### Condition Share\\nThe percentage share of all conditions from all observations reporting conditions in the given time period. Keep in mind that individual observations can have multiple conditions.\\n#### Unit Symptom health\\nA table that shows the number of observations received on a per unit basis where the individual reported symptoms or conditions."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '09c49db0-e94f-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Data Quality Issues Text',
        'visState': '{"title":"Data Quality Issues Text","type":"markdown","params":{"fontSize":24,"openLinksInNewTab":false,"markdown":"Data Quality / Issues\\n---"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e2e816d0-29e6-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals Per Risk Category',
        'visState': '{"title":"Individuals Per Risk Category","type":"line","params":{"addLegend":true,"addTimeMarker":false,"addTooltip":true,"categoryAxes":[{"id":"CategoryAxis-1","labels":{"show":true,"truncate":100},"position":"bottom","scale":{"type":"linear"},"show":true,"style":{},"title":{},"type":"category"}],"grid":{"categoryLines":false,"style":{"color":"#eee"}},"legendPosition":"right","seriesParams":[{"data":{"id":"1","label":"Count"},"drawLinesBetweenPoints":true,"mode":"normal","show":"true","showCircles":true,"type":"line","valueAxis":"ValueAxis-1"}],"times":[],"type":"line","valueAxes":[{"id":"ValueAxis-1","labels":{"filter":false,"rotate":0,"show":true,"truncate":100},"name":"LeftAxis-1","position":"left","scale":{"mode":"normal","type":"linear"},"show":true,"style":{},"title":{"text":"Count"},"type":"value"}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f4b06bd0-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total symptoms reported by Unit',
        'visState': '{"title":"Total symptoms reported by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Total symptoms reported"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Total symptoms reported","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total symptoms reported"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c39b0090-229c-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions tracking',
        'visState': '{"title":"Conditions tracking","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bd1983b0-51f7-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Daily Muster Non-Compliance',
        'visState': '{"title":"Daily Muster Non-Compliance","type":"area","params":{"type":"area","grid":{"categoryLines":false,"style":{"color":"#eee"},"valueAxis":null},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"percentage","defaultYExtents":false},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Percentage"}}],"seriesParams":[{"show":"true","type":"area","mode":"stacked","data":{"label":"Count","id":"1"},"drawLinesBetweenPoints":true,"showCircles":true,"interpolate":"linear","valueAxis":"ValueAxis-1"}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"filters","schema":"group","params":{"filters":[{"input":{"query":"Muster.reported: false"},"label":"Number NOT reporting"},{"input":{"query":"Muster.reported: true"},"label":"Number Reporting"}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"colors":{"Number NOT reporting":"#E24D42","Number Reporting":"#BADFF4"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '8e685260-2a94-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Average Risk Score',
        'visState': '{"title":"Average Risk Score","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Risk Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Risk Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score","customLabel":"Average Risk Score"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'a0eeda70-229d-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom reports by Unit Heatmap',
        'visState': '{"title":"Symptom reports by Unit Heatmap","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Unit"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 65":"rgb(247,252,245)","65 - 130":"rgb(199,233,192)","130 - 195":"rgb(116,196,118)","195 - 260":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '91ed9950-eecf-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations over time by Lodging',
        'visState': '{"title":"Observations over time by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '800b9af0-2a95-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'At-risk individuals by Unit',
        'visState': '{"title":"At-risk individuals by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"should":[{"terms":{"Category.keyword":["very high","high"]}},{"bool":{"must":[{"term":{"Category.keyword":"medium"}},{"range":{"Details.TemperatureFahrenheit":{"gte":102}}}]}}]}},"meta":{"negate":false,"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","disabled":false,"alias":"v. high, high, or (medium and temp >= 102)","type":"custom","key":"query","value":"{\\"bool\\":{\\"should\\":[{\\"terms\\":{\\"Category.keyword\\":[\\"very high\\",\\"high\\"]}},{\\"bool\\":{\\"must\\":[{\\"term\\":{\\"Category.keyword\\":\\"medium\\"}},{\\"range\\":{\\"Details.TemperatureFahrenheit\\":{\\"gte\\":102}}}]}}]}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '0df55b40-51eb-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Unit Muster Non-Compliance rate',
        'visState': '{"title":"Unit Muster Non-Compliance rate","type":"enhanced-table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum","computedColumns":[{"label":"Muster non-compliance rate","formula":"col2 / col1","format":"number","pattern":"0,0%","alignment":"left","applyAlignmentOnTitle":true,"applyAlignmentOnTotal":true,"applyTemplate":false,"applyTemplateOnTotal":true,"template":"{{value}}","enabled":true}],"computedColsPerSplitCol":false,"hideExportLinks":false,"showFilterBar":false,"filterCaseSensitive":false,"filterBarHideable":false,"filterAsYouType":false,"filterTermsSeparately":false,"filterHighlightResults":false,"filterBarWidth":"25%","hiddenColumns":"1,2"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"2","enabled":true,"type":"filters","schema":"splitcols","params":{"filters":[{"input":{"query":"*"},"label":""},{"input":{"query":"Muster.reported: false"}}]},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"kuery"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'ebe2c2e0-eecb-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions prevalence by Lodging',
        'visState': '{"title":"Conditions prevalence by Lodging","type":"line","params":{"addLegend":true,"addTimeMarker":false,"addTooltip":true,"categoryAxes":[{"id":"CategoryAxis-1","labels":{"show":true,"truncate":100},"position":"bottom","scale":{"type":"linear"},"show":true,"style":{},"title":{},"type":"category"}],"grid":{"categoryLines":false,"style":{"color":"#eee"}},"legendPosition":"right","seriesParams":[{"data":{"id":"1","label":"Count"},"drawLinesBetweenPoints":true,"mode":"normal","show":"true","showCircles":true,"type":"line","valueAxis":"ValueAxis-1"}],"times":[],"type":"line","valueAxes":[{"id":"ValueAxis-1","labels":{"filter":false,"rotate":0,"show":true,"truncate":100},"name":"LeftAxis-1","position":"left","scale":{"mode":"normal","type":"linear"},"show":true,"style":{},"title":{"text":"Count"},"type":"value"}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Conditions.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"4","enabled":true,"type":"terms","schema":"split","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","row":true}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'd3be0d70-eec4-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom prevalence by Lodging',
        'visState': '{"title":"Symptom prevalence by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"d","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}},{"id":"4","enabled":true,"type":"terms","schema":"split","params":{"field":"Details.Lodging.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","row":true}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '12409630-29ee-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Individuals by Category',
        'visState': '{"title":"Individuals by Category","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '5c298f90-eecf-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Talk to someone Observation Share',
        'visState': '{"title":"Talk to someone Observation Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.TalkToSomeone","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '783c2c90-eecc-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Symptom and Condition Prevalence by Lodging',
        'visState': '{"title":"Cohort Symptom and Condition Prevalence by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":500,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '4fef2150-e93d-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort coronavirus risk',
        'visState': '{"title":"Cohort coronavirus risk","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Category.keyword","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'bf289fd0-61a9-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Unit Symptom Health',
        'visState': '{"title":"Unit Symptom Health","type":"table","params":{"perPage":10,"showPartialRows":false,"showMetricsAtAllLevels":false,"sort":{"columnIndex":null,"direction":null},"showTotal":false,"totalFunc":"sum"},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Observations with symptoms or conditions"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"bucket","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"params":{"sort":{"columnIndex":null,"direction":null}}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"query":{"bool":{"filter":{"bool":{"should":[{"exists":{"field":"Details.Symptoms.keyword"}},{"exists":{"field":"Details.Conditions.keyword"}}]}}}},"meta":{"negate":false,"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","disabled":false,"alias":"Conditions OR Symptoms Exist","type":"custom","key":"query","value":"{\\"bool\\":{\\"filter\\":{\\"bool\\":{\\"should\\":[{\\"exists\\":{\\"field\\":\\"Details.Symptoms.keyword\\"}},{\\"exists\\":{\\"field\\":\\"Details.Conditions.keyword\\"}}]}}}}"},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '15be3790-618e-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom Trending Line Graph',
        'visState': '{"title":"Symptom Trending Line Graph","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '40f18f20-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Units',
        'visState': '{"title":"Total Units","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"cardinality","schema":"metric","params":{"field":"_index","customLabel":"Total Units"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '01bd38c0-229d-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Conditions reported by Unit',
        'visState': '{"title":"Total Conditions reported by Unit","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Total conditions reported"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Total conditions reported","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total conditions reported"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '9d2f98b0-eecd-11ea-aec4-4103718388c0',
      '_type': 'visualization',
      '_source': {
        'title': 'Observations by Time',
        'visState': '{"title":"Observations by Time","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e201d150-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Observations',
        'visState': '{"title":"Total Observations","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1885c850-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Condition reports by Unit Heatmap',
        'visState': '{"title":"Condition reports by Unit Heatmap","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Roster.unit.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 50":"rgb(247,252,245)","50 - 100":"rgb(199,233,192)","100 - 150":"rgb(116,196,118)","150 - 200":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '7afa6720-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Conditions by Lodging',
        'visState': '{"title":"Conditions by Lodging","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Conditions"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Lodging"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 12":"rgb(247,252,245)","12 - 23":"rgb(199,233,192)","23 - 34":"rgb(116,196,118)","34 - 45":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b976ad90-229b-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom tracking',
        'visState': '{"title":"Symptom tracking","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Number reporting given symptom"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Number reporting given symptom","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Number reporting given symptom"},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{},"customLabel":""},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Symptoms.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'dd03d8d0-e94a-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Observations',
        'visState': '{"title":"Total Observations","type":"metric","params":{"addTooltip":true,"addLegend":false,"type":"metric","metric":{"percentageMode":false,"useRanges":false,"colorSchema":"Green to Red","metricColorMode":"None","colorsRange":[{"from":0,"to":10000}],"labels":{"show":true},"invertColors":false,"style":{"bgFill":"#000","bgColor":false,"labelColor":false,"subText":"","fontSize":60}}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{"customLabel":"Total Observations"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '496c5380-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom Share',
        'visState': '{"title":"Symptom Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '57e71030-229e-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Symptom reports by Lodging',
        'visState': '{"title":"Symptom reports by Lodging","type":"heatmap","params":{"type":"heatmap","addTooltip":true,"addLegend":true,"enableHover":false,"legendPosition":"right","times":[],"colorsNumber":4,"colorSchema":"Greens","setColorRange":false,"colorsRange":[],"invertColors":false,"percentageMode":false,"valueAxes":[{"show":false,"id":"ValueAxis-1","type":"value","scale":{"type":"linear","defaultYExtents":false},"labels":{"show":false,"rotate":0,"overwriteColor":false,"color":"#555"}}]},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Symptoms.keyword","size":49997,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Symptoms"},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing","customLabel":"Lodging"},"hidden":false}]}',
        'uiStateJSON': '{"vis":{"defaultColors":{"0 - 12":"rgb(247,252,245)","12 - 23":"rgb(199,233,192)","23 - 34":"rgb(116,196,118)","34 - 45":"rgb(35,139,69)"}}}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '354112d0-e93f-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Symptom and Condition Prevalence',
        'visState': '{"title":"Cohort Symptom and Condition Prevalence","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Average Score"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Average Score","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"avg","schema":"metric","params":{"field":"Score"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c95255a0-e93b-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort Anxiety / Concern',
        'visState': '{"title":"Cohort Anxiety / Concern","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Sum of Details.TalkToSomeone"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Sum of Details.TalkToSomeone","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"sum","schema":"metric","params":{"field":"Details.TalkToSomeone"}},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '308b9ce0-e946-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Condition Share',
        'visState': '{"title":"Condition Share","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":false,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Details.Conditions.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c3644b10-229a-11eb-aa43-cf97fefcff0e',
      '_type': 'dashboard',
      '_source': {
        'title': 'Force Health',
        'hits': 0,
        'description': 'Monitoring overall health of the force',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":38,"y":0,"w":10,"h":21,"i":"2"},"id":"40f18f20-229b-11eb-aa43-cf97fefcff0e","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":50,"w":24,"h":12,"i":"3"},"id":"b976ad90-229b-11eb-aa43-cf97fefcff0e","panelIndex":"3","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":78,"w":24,"h":15,"i":"4"},"id":"f4b06bd0-229b-11eb-aa43-cf97fefcff0e","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":14,"y":0,"w":13,"h":21,"i":"5"},"id":"6f708620-229c-11eb-aa43-cf97fefcff0e","panelIndex":"5","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":50,"w":24,"h":12,"i":"6"},"id":"c39b0090-229c-11eb-aa43-cf97fefcff0e","panelIndex":"6","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":78,"w":24,"h":15,"i":"7"},"id":"01bd38c0-229d-11eb-aa43-cf97fefcff0e","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":111,"w":24,"h":19,"i":"8"},"id":"a0eeda70-229d-11eb-aa43-cf97fefcff0e","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":111,"w":24,"h":19,"i":"9"},"id":"1885c850-229e-11eb-aa43-cf97fefcff0e","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":130,"w":24,"h":15,"i":"10"},"id":"57e71030-229e-11eb-aa43-cf97fefcff0e","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":130,"w":24,"h":15,"i":"11"},"id":"7afa6720-229e-11eb-aa43-cf97fefcff0e","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":37,"w":24,"h":13,"i":"12"},"id":"e2e816d0-29e6-11eb-aa43-cf97fefcff0e","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":37,"w":24,"h":13,"i":"13"},"id":"8e685260-2a94-11eb-aa43-cf97fefcff0e","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":62,"w":24,"h":16,"i":"14"},"id":"800b9af0-2a95-11eb-aa43-cf97fefcff0e","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":14,"h":21,"i":"15"},"id":"b5c163d0-61bf-11eb-ab11-f728fb6de5ec","panelIndex":"15","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":21,"w":48,"h":16,"i":"17"},"id":"5902bef0-6250-11eb-ab11-f728fb6de5ec","panelIndex":"17","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":62,"w":24,"h":16,"i":"18"},"id":"9bf611c0-6251-11eb-ab11-f728fb6de5ec","panelIndex":"18","type":"visualization","version":"6.4.1"},{"gridData":{"x":0,"y":93,"w":48,"h":18,"i":"19"},"version":"6.4.1","panelIndex":"19","type":"visualization","id":"a2f3d060-6252-11eb-ab11-f728fb6de5ec","embeddableConfig":{}},{"gridData":{"x":27,"y":0,"w":11,"h":21,"i":"20"},"version":"6.4.1","panelIndex":"20","type":"visualization","id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-14d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '2f5db6e0-eeba-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Muster Non-Compliance',
        'hits': 0,
        'description': 'A Dashboard for examining muster non-compliance across a cohort',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":19,"y":0,"w":13,"h":11,"i":"9"},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":19,"h":24,"i":"10"},"id":"82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":39,"w":24,"h":15,"i":"11"},"id":"bd1983b0-51f7-11eb-b1c2-819d629adfcd","panelIndex":"11","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":32,"y":0,"w":16,"h":24,"i":"13"},"id":"0df55b40-51eb-11eb-b1c2-819d629adfcd","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":39,"w":24,"h":15,"i":"14"},"id":"8c85ee40-544b-11eb-b1c2-819d629adfcd","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":24,"w":48,"h":15,"i":"15"},"id":"abab3d40-61a0-11eb-ab11-f728fb6de5ec","panelIndex":"15","type":"visualization","version":"6.4.1"},{"gridData":{"x":19,"y":11,"w":13,"h":13,"i":"16"},"version":"6.4.1","panelIndex":"16","type":"visualization","id":"e201d150-229a-11eb-aa43-cf97fefcff0e","embeddableConfig":{}}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-5y',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'f1a95bb0-eeb9-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Mental Health',
        'hits': 0,
        'description': 'A dashboard for relevantly tracking the "Talk to someone" field from service member submissions.',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"h":17,"i":"3","w":12,"x":25,"y":0},"id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","panelIndex":"3","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":14,"i":"4","w":32,"x":16,"y":27},"id":"c95255a0-e93b-11ea-b481-91d592e28f0d","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":14,"i":"7","w":16,"x":0,"y":27},"id":"5c298f90-eecf-11ea-aec4-4103718388c0","panelIndex":"7","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":17,"i":"8","w":13,"x":12,"y":0},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":17,"i":"9","w":12,"x":0,"y":0},"id":"e25abde0-e94e-11ea-b481-91d592e28f0d","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"h":10,"i":"12","w":48,"x":0,"y":17},"id":"89db5d70-618d-11eb-ab11-f728fb6de5ec","panelIndex":"12","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-14d/d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '8c85ee40-544b-11eb-b1c2-819d629adfcd',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster timing',
        'visState': '{"title":"Muster timing","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Muster.status.keyword","size":5000,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'c539a380-6265-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Cohort At-risk Individual Count by Lodging',
        'visState': '{"title":"Cohort At-risk Individual Count by Lodging","type":"line","params":{"type":"line","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Count"}}],"seriesParams":[{"show":"true","type":"line","mode":"normal","data":{"label":"Count","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{},"hidden":false},{"id":"2","enabled":true,"type":"date_histogram","schema":"segment","params":{"field":"Timestamp","interval":"auto","customInterval":"2h","min_doc_count":1,"extended_bounds":{}},"hidden":false},{"id":"3","enabled":true,"type":"terms","schema":"group","params":{"field":"Details.Lodging.keyword","size":50,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"},"hidden":false}]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"index":"74234ab0-229a-11eb-aa43-cf97fefcff0e","query":{"query":"","language":"lucene"},"filter":[{"meta":{"index":"0767d120-2367-11eb-aa43-cf97fefcff0e","type":"phrases","key":"Category.keyword","value":"high, very high","params":["high","very high"],"negate":false,"disabled":false,"alias":null},"query":{"bool":{"should":[{"match_phrase":{"Category.keyword":"high"}},{"match_phrase":{"Category.keyword":"very high"}}],"minimum_should_match":1}},"$state":{"store":"appState"}}]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Muster Compliance Text',
        'visState': '{"title":"Muster Compliance Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Muster Non-Compliance\\nA dashboard supplying various ways of examining muster non-compliance across a cohort.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of Observations in the cohort under examination.\\n#### Unit Muster Non-Compliance Rate\\nA table of units along with the percentage of times individuals in the unit did not report during muster for the given time period."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '6acea320-6268-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Total Individuals Estimate',
        'visState': '{"title":"Total Individuals Estimate","type":"metrics","params":{"id":"61ca57f0-469d-11e7-af02-69e470af7417","type":"metric","series":[{"id":"61ca57f1-469d-11e7-af02-69e470af7417","color":"#68BC00","split_mode":"everything","metrics":[{"id":"61ca57f2-469d-11e7-af02-69e470af7417","type":"count"}],"separate_axis":0,"axis_position":"right","formatter":"number","chart_type":"line","line_width":1,"point_size":1,"fill":0.5,"stacked":"none","terms_field":null}],"time_field":"@timestamp","index_pattern":"*health","interval":"auto","axis_position":"left","axis_formatter":"number","axis_scale":"normal","show_legend":1,"show_grid":1,"background_color_rules":[{"id":"39bfbd00-6268-11eb-90af-9382121263d2"}],"bar_color_rules":[{"id":"5a224bd0-6268-11eb-90af-9382121263d2"}]},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'b5c163d0-61bf-11eb-ab11-f728fb6de5ec',
      '_type': 'visualization',
      '_source': {
        'title': 'Force Health Dashboard Intro text',
        'visState': '{"title":"Force Health Dashboard Intro text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"# Force Health Dashboard\\nThis dashboard provides a number of visualizations related to examining and exploring force health.\\n\\n#### Health Control Board\\nA set of controls for setting filters on unit, lodging, symptoms, or conditions. Choose apply changes to change the filters.\\n\\n#### Total Observations\\nThe total number of Observations in the cohort under examination.\\n\\n#### Total Units\\nThe total number of units represented by individuals making up the cohort under examination."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1',
      '_type': 'visualization',
      '_source': {
        'title': 'Health / Symptom Tracking Text',
        'visState': '{"title":"Health / Symptom Tracking Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":true,"markdown":"# Health / Symptom Tracking\\nA dashboard for tracking servicemember symptoms and coronavirus exposure potential\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\"Last 15 minutes\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of symptoms observations."},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e25abde0-e94e-11ea-b481-91d592e28f0d',
      '_type': 'visualization',
      '_source': {
        'title': 'Mental Health Text',
        'visState': '{"title":"Mental Health Text","type":"markdown","params":{"fontSize":12,"openLinksInNewTab":false,"markdown":"Mental Health\\n---\\n\\n#### Control Board\\n\\nControls for selecting unit and lodging filters to be applied to the other visualizations\\n\\n#### Total Observations\\n\\nThe total number of symptom observations given within the specified time range"},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '061fb350-eeba-11ea-aa5e-43987d01131d',
      '_type': 'dashboard',
      '_source': {
        'title': 'Health / Symptom Tracking',
        'hits': 0,
        'description': 'A dashboard for tracking soldier symptoms and coronavirus exposure potential',
        'panelsJSON': '[{"embeddableConfig":{},"gridData":{"x":14,"y":63,"w":34,"h":12,"i":"1"},"id":"4fef2150-e93d-11ea-b481-91d592e28f0d","panelIndex":"1","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":14,"y":51,"w":34,"h":12,"i":"2"},"id":"354112d0-e93f-11ea-b481-91d592e28f0d","panelIndex":"2","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":21,"y":12,"w":27,"h":8,"i":"4"},"id":"dd03d8d0-e94a-11ea-b481-91d592e28f0d","panelIndex":"4","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":107,"w":24,"h":46,"i":"8"},"id":"d3be0d70-eec4-11ea-aec4-4103718388c0","panelIndex":"8","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":107,"w":24,"h":46,"i":"9"},"id":"ebe2c2e0-eecb-11ea-aec4-4103718388c0","panelIndex":"9","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":92,"w":24,"h":15,"i":"10"},"id":"783c2c90-eecc-11ea-aec4-4103718388c0","panelIndex":"10","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":36,"w":24,"h":15,"i":"12"},"id":"308b9ce0-e946-11ea-b481-91d592e28f0d","panelIndex":"12","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":36,"w":24,"h":15,"i":"13"},"id":"496c5380-e946-11ea-b481-91d592e28f0d","panelIndex":"13","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":21,"y":0,"w":27,"h":12,"i":"14"},"id":"18aa2a20-f444-11ea-82b7-4bc5055cc562","panelIndex":"14","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":0,"w":21,"h":20,"i":"15"},"id":"1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1","panelIndex":"15","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":20,"w":24,"h":16,"i":"16"},"id":"55ae0f90-61a9-11eb-ab11-f728fb6de5ec","panelIndex":"16","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":20,"w":24,"h":16,"i":"17"},"id":"bf289fd0-61a9-11eb-ab11-f728fb6de5ec","panelIndex":"17","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":51,"w":14,"h":24,"i":"18"},"id":"cb8f07b0-61b7-11eb-ab11-f728fb6de5ec","panelIndex":"18","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":0,"y":75,"w":48,"h":17,"i":"20"},"id":"b79376a0-61bd-11eb-ab11-f728fb6de5ec","panelIndex":"20","type":"visualization","version":"6.4.1"},{"embeddableConfig":{},"gridData":{"x":24,"y":92,"w":24,"h":15,"i":"21"},"id":"c539a380-6265-11eb-ab11-f728fb6de5ec","panelIndex":"21","type":"visualization","version":"6.4.1"}]',
        'optionsJSON': '{"darkTheme":false,"hidePanelTitles":false,"useMargins":true}',
        'version': 1,
        'timeRestore': true,
        'timeTo': 'now',
        'timeFrom': 'now-7d',
        'refreshInterval': {
          'pause': true,
          'value': 0,
        },
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': 'e292ffd0-2863-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Alert - Control Board - Base',
        'visState': '{"title":"Alert - Control Board - Base","type":"input_control_vis","params":{"controls":[{"id":"1599843098242","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1599843111344","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1605806664606","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Details.Symptoms.keyword","parent":"","label":"Symptoms - Select all that apply (no selection implies all symptoms)","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"language":"lucene","query":""},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '6f708620-229c-11eb-aa43-cf97fefcff0e',
      '_type': 'visualization',
      '_source': {
        'title': 'Health control board',
        'visState': '{"title":"Health control board","type":"input_control_vis","params":{"controls":[{"id":"1604933946497","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933991588","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933914012","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Details.Symptoms.keyword","parent":"","label":"Symptoms","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1604933973627","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Details.Conditions.keyword","parent":"","label":"Conditions","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
    {
      '_id': '18aa2a20-f444-11ea-82b7-4bc5055cc562',
      '_type': 'visualization',
      '_source': {
        'title': 'Control Board',
        'visState': '{"title":"Control Board","type":"input_control_vis","params":{"controls":[{"id":"1599843098242","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Roster.unit.keyword","parent":"","label":"Unit","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}},{"id":"1599843111344","indexPattern":"74234ab0-229a-11eb-aa43-cf97fefcff0e","fieldName":"Details.Lodging.keyword","parent":"","label":"Lodging","type":"list","options":{"type":"terms","multiselect":true,"dynamicOptions":true,"size":5,"order":"desc"}}],"updateFiltersOnChange":false,"useTimeFilter":false,"pinFilters":false},"aggs":[]}',
        'uiStateJSON': '{}',
        'description': '',
        'version': 1,
        'kibanaSavedObjectMeta': {
          'searchSourceJSON': '{"query":{"query":"","language":"lucene"},"filter":[]}',
        },
      },
      '_meta': {
        'savedObjectVersion': 2,
      },
    },
  ],
};

const kibanaSavedObjectsMockNew = {
  phi: [
    {
      "_id": "6541d8b0-2e69-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Disposition\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Disposition.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Provider Notes\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Provider Notes.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Testing Status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Testing Status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.advancedParty\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.aircrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.billetWorkcenter\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.billetWorkcenter.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdi\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdqar\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.contractNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.contractNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.covid19TestReturnDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dscacrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.edipi.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.firstName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.firstName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.lastName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastReported\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pilot\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pui\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rateRank\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rateRank.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rom.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.romRelease\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.romRelease.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.undefined\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.undefined.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"config.buildNum\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"config.defaultIndex\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"config.defaultIndex.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.hits\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.optionsJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.panelsJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.refreshInterval.display\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.refreshInterval.pause\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.refreshInterval.section\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.refreshInterval.value\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.timeFrom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.timeRestore\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.timeTo\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.uiStateJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.fieldFormatMap\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"index-pattern.fields\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"index-pattern.intervalName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.notExpandable\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.sourceFilters\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"index-pattern.timeFieldName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.columns\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"search.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.hits\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"search.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.sort\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"search.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"server.uuid\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.hits\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.timelion_chart_height\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_columns\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_interval\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_other_interval\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_rows\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_sheet\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"updated_at\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.accessCount\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.accessDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.createDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.url\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"url.url.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"visualization.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.savedSearchId\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"visualization.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.uiStateJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"visualization.visState\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false}]"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a8de1010-2532-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-reports",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.durationMinutes\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.endTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.id.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.reported\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTime\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.startTime.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.timezone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.timezone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Disposition\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Disposition.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Provider Notes\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Provider Notes.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Testing Status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Testing Status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.advancedParty\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.aircrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.billetWorkcenter\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.billetWorkcenter.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdi\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdqar\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.contractNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.contractNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.covid19TestReturnDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dept\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.dept.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.div\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.div.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dscacrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.edipi.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.firstName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.firstName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.in_rom\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.lastName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastReported\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.phone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.phone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pilot\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pui\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rate\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rate.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rateRank\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rateRank.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rom.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.romRelease\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.romRelease.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom_end\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom_start\",\"type\":\"conflict\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false,\"conflictDescriptions\":{\"date\":[\"testgroup1-airhawk-phi-es6ddssymptomobs-reports\",\"testgroup1-black_death-phi-es6ddssymptomobs-reports\",\"testgroup1-bloody_bucket-phi-es6ddssymptomobs-reports\",\"testgroup1-devils_in_baggy_pants-phi-es6ddssymptomobs-reports\",\"testgroup1-example_text-phi-es6ddssymptomobs-reports\",\"testgroup1-grey_ghost-phi-es6ddssymptomobs-reports\",\"testgroup1-phantom-phi-es6ddssymptomobs-reports\",\"testgroup1-steel_rain-phi-es6ddssymptomobs-reports\"],\"text\":[\"testgroup1-blue_ghost-phi-es6ddssymptomobs-reports\"]}},{\"name\":\"Roster.rom_start.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.traveler_or_contact\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.traveler_or_contact.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.undefined\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.undefined.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Muster List Text",
        "visState": "{\"title\":\"Muster List Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Muster List\\nList of individuals with the last time they submitted an observation.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Soldier Observation Follow-up\\nA table that displays when the last time an individual submitted a symptoms observation report. Each row in the table shows the EDIPI, the individual's phone number, name, lodging, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the three columns.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f4558e30-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Coronavirus Health Text",
        "visState": "{\"title\":\"Coronavirus Health Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":24,\"openLinksInNewTab\":false,\"markdown\":\"Coronavirus Exposure / Symptoms\\n---\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e292ffd0-2863-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Alert - Control Board - Base",
        "visState": "{\"title\":\"Alert - Control Board - Base\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1599843098242\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1599843111344\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605806664606\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Symptoms.keyword\",\"parent\":\"\",\"label\":\"Symptoms - Select all that apply (no selection implies all symptoms)\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "6f708620-229c-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Health control board",
        "visState": "{\"title\":\"Health control board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1604933946497\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933991588\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933914012\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Symptoms.keyword\",\"parent\":\"\",\"label\":\"Symptoms\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933973627\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Conditions.keyword\",\"parent\":\"\",\"label\":\"Conditions\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "78114120-2855-11eb-8bde-57c4cf572790",
      "_type": "visualization",
      "_source": {
        "title": "Medical Health Aggregation Control Board",
        "visState": "{\"title\":\"Medical Health Aggregation Control Board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1605563290045\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"EDIPI.keyword\",\"parent\":\"\",\"label\":\"EDIPI\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":false,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605799680710\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.firstName.keyword\",\"parent\":\"\",\"label\":\"First\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605799712742\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.lastName.keyword\",\"parent\":\"\",\"label\":\"Last\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "91ed9950-eecf-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Observations over time by Lodging",
        "visState": "{\"title\":\"Observations over time by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "18aa2a20-f444-11ea-82b7-4bc5055cc562",
      "_type": "visualization",
      "_source": {
        "title": "Control Board",
        "visState": "{\"title\":\"Control Board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1599843098242\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1599843111344\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "308b9ce0-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Condition Share",
        "visState": "{\"title\":\"Condition Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "496c5380-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Symptom Share",
        "visState": "{\"title\":\"Symptom Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "09c49db0-e94f-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Data Quality Issues Text",
        "visState": "{\"title\":\"Data Quality Issues Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":24,\"openLinksInNewTab\":false,\"markdown\":\"Data Quality / Issues\\n---\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "353451a0-f8e2-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Individuals That Would Like to Talk to Someone Text",
        "visState": "{\"title\":\"Individuals That Would Like to Talk to Someone Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Individuals That Would Like to Talk to Someone\\nList of individuals that indicated they \\\"would like to talk someone\\\" in their submission\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Talk To Someone Recency Board\\nA table that shows all individuals who want to talk to someone. Each row in the table shows the EDIPI, name, phone, lodging, unit, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the columns.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c8f9d790-e94a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Total Individuals",
        "visState": "{\"title\":\"Total Individuals\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"EDIPI.keyword\",\"customLabel\":\"Persons\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b1526e90-eecc-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Cohort At-Risk Individual Count by Lodging",
        "visState": "{\"title\":\"Cohort At-Risk Individual Count by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count of Individuals with \\\"High\\\" or \\\"Very High\\\" observation\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count of Individuals with \\\"High\\\" or \\\"Very High\\\" observation\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"EDIPI.keyword\",\"customLabel\":\"Count of Individuals with \\\"High\\\" or \\\"Very High\\\" observation\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":false,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"meta\":{\"index\":\"52a6e670-f442-11ea-82b7-4bc5055cc562\",\"type\":\"phrases\",\"key\":\"Category.keyword\",\"value\":\"high, very_high\",\"params\":[\"high\",\"very_high\"],\"negate\":false,\"disabled\":false,\"alias\":null},\"query\":{\"bool\":{\"should\":[{\"match_phrase\":{\"Category.keyword\":\"high\"}},{\"match_phrase\":{\"Category.keyword\":\"very_high\"}}],\"minimum_should_match\":1}},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "6d948390-e94b-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Observations by Unit and Lodging",
        "visState": "{\"title\":\"Observations by Unit and Lodging\",\"type\":\"histogram\",\"params\":{\"type\":\"histogram\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"histogram\",\"mode\":\"stacked\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Unit.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "d3be0d70-eec4-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Symptom prevalence by Lodging",
        "visState": "{\"title\":\"Symptom prevalence by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"row\":true}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "12409630-29ee-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Individuals by Category",
        "visState": "{\"title\":\"Individuals by Category\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "4fef2150-e93d-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort coronavirus risk",
        "visState": "{\"title\":\"Cohort coronavirus risk\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1c7a8120-f446-11ea-82b7-4bc5055cc562",
      "_type": "dashboard",
      "_source": {
        "title": "Muster List",
        "hits": 0,
        "description": "List of individuals with the last time they submitted an observation.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":15,\"w\":48,\"h\":31,\"i\":\"1\"},\"id\":\"bbabdb50-eecd-11ea-aec4-4103718388c0\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":48,\"h\":15,\"i\":\"2\"},\"id\":\"cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-24h",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "d2f7e8d0-3c98-11eb-aa43-cf97fefcff0e",
      "_type": "search",
      "_source": {
        "title": "DAVE - Individuals Mustered",
        "description": "",
        "hits": 0,
        "columns": [
          "Timestamp",
          "Browser.TimeZone",
          "Roster.edipi",
          "Roster.lastReported",
          "Details.Unit"
        ],
        "sort": [
          "Timestamp",
          "desc"
        ],
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"6541d8b0-2e69-11eb-aa43-cf97fefcff0e\",\"highlightAll\":true,\"version\":true,\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c9198a80-2514-11eb-aa43-cf97fefcff0e",
      "_type": "search",
      "_source": {
        "title": "Alert - User Needs Medical Attention - Base",
        "description": "",
        "hits": 0,
        "columns": [
          "Roster.unit",
          "Category",
          "Details.TemperatureFahrenheit",
          "Details.TalkToSomeone",
          "Score"
        ],
        "sort": [
          "Timestamp",
          "desc"
        ],
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"highlightAll\":true,\"version\":true,\"query\":{\"language\":\"kuery\",\"query\":\"(Category.keyword  :  \\\"very high\\\" ) or (Category.keyword  : \\\"high\\\" ) or (Category.keyword : \\\"medium\\\" ) or (Details.TemperatureFahrenheit >= 102) or (Details.TalkToSomeone :  1)\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5c298f90-eecf-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Talk to someone Observation Share",
        "visState": "{\"title\":\"Talk to someone Observation Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.TalkToSomeone\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "783c2c90-eecc-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Symptom and Condition Prevalence by Lodging",
        "visState": "{\"title\":\"Cohort Symptom and Condition Prevalence by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "ebe2c2e0-eecb-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Conditions prevalence by Lodging",
        "visState": "{\"title\":\"Conditions prevalence by Lodging\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"mode\":\"normal\",\"show\":\"true\",\"showCircles\":true,\"type\":\"line\",\"valueAxis\":\"ValueAxis-1\"}],\"times\":[],\"type\":\"line\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"row\":true}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "dd03d8d0-e94a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Total Observations",
        "visState": "{\"title\":\"Total Observations\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total Observations\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c95255a0-e93b-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Anxiety / Concern",
        "visState": "{\"title\":\"Cohort Anxiety / Concern\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Sum of Details.TalkToSomeone\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Sum of Details.TalkToSomeone\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.TalkToSomeone\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "354112d0-e93f-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Symptom and Condition Prevalence",
        "visState": "{\"title\":\"Cohort Symptom and Condition Prevalence\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cf5f1900-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Application Share",
        "visState": "{\"title\":\"Application Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Client.Application.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "9d2f98b0-eecd-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Observations by Time",
        "visState": "{\"title\":\"Observations by Time\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bbabdb50-eecd-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Soldier Observation follow-up",
        "visState": "{\"title\":\"Soldier Observation follow-up\",\"type\":\"table\",\"params\":{\"perPage\":20,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":2,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Timestamp\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Date Time of Last Observation\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"time_since_obs_hours\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Hours Since Last Observation\"},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Details.PhoneNumber.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Phone\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":2,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "4e827950-e93a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Talk to someone recency board",
        "visState": "{\"title\":\"Talk to someone recency board\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":1,\"direction\":\"desc\"},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Timestamp\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\"},\"hidden\":false},{\"id\":\"1\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.TalkToSomeone\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Talk to Someone\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"time_since_obs_hours\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Hours since observation\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last\"},\"hidden\":false},{\"id\":\"8\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Details.PhoneNumber.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Phone\"},\"hidden\":false},{\"id\":\"9\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":1,\"direction\":\"desc\"}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"meta\":{\"index\":\"9b3b4f90-e937-11ea-b481-91d592e28f0d\",\"negate\":false,\"disabled\":false,\"alias\":null,\"type\":\"phrase\",\"key\":\"Details.TalkToSomeone\",\"value\":1,\"params\":{\"query\":1,\"type\":\"phrase\"}},\"query\":{\"match\":{\"Details.TalkToSomeone\":{\"query\":1,\"type\":\"phrase\"}}},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "ce0996b0-eece-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Individual Compliance",
        "visState": "{\"title\":\"Individual Compliance\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total Observations\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First\"},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7afa6720-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Conditions by Lodging",
        "visState": "{\"title\":\"Conditions by Lodging\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Conditions\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Lodging\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 12\":\"rgb(247,252,245)\",\"12 - 23\":\"rgb(199,233,192)\",\"23 - 34\":\"rgb(116,196,118)\",\"34 - 45\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e201d150-229a-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Observations",
        "visState": "{\"title\":\"Total Observations\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f4b06bd0-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total symptoms reported by Unit",
        "visState": "{\"title\":\"Total symptoms reported by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Total symptoms reported\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Total symptoms reported\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total symptoms reported\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c39b0090-229c-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Conditions tracking",
        "visState": "{\"title\":\"Conditions tracking\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b976ad90-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom tracking",
        "visState": "{\"title\":\"Symptom tracking\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Number reporting given symptom\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Number reporting given symptom\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Number reporting given symptom\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "8e685260-2a94-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Average Risk Score",
        "visState": "{\"title\":\"Average Risk Score\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Risk Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Risk Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\",\"customLabel\":\"Average Risk Score\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e2e816d0-29e6-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Individuals Per Risk Category",
        "visState": "{\"title\":\"Individuals Per Risk Category\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"mode\":\"normal\",\"show\":\"true\",\"showCircles\":true,\"type\":\"line\",\"valueAxis\":\"ValueAxis-1\"}],\"times\":[],\"type\":\"line\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a0eeda70-229d-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom reports by Unit Heatmap",
        "visState": "{\"title\":\"Symptom reports by Unit Heatmap\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 65\":\"rgb(247,252,245)\",\"65 - 130\":\"rgb(199,233,192)\",\"130 - 195\":\"rgb(116,196,118)\",\"195 - 260\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "800b9af0-2a95-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "At-risk individuals by Unit",
        "visState": "{\"title\":\"At-risk individuals by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"should\":[{\"terms\":{\"Category.keyword\":[\"very high\",\"high\"]}},{\"bool\":{\"must\":[{\"term\":{\"Category.keyword\":\"medium\"}},{\"range\":{\"Details.TemperatureFahrenheit\":{\"gte\":102}}}]}}]}},\"meta\":{\"negate\":false,\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"disabled\":false,\"alias\":\"v. high, high, or (medium and temp >= 102)\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"should\\\":[{\\\"terms\\\":{\\\"Category.keyword\\\":[\\\"very high\\\",\\\"high\\\"]}},{\\\"bool\\\":{\\\"must\\\":[{\\\"term\\\":{\\\"Category.keyword\\\":\\\"medium\\\"}},{\\\"range\\\":{\\\"Details.TemperatureFahrenheit\\\":{\\\"gte\\\":102}}}]}}]}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1885c850-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Condition reports by Unit Heatmap",
        "visState": "{\"title\":\"Condition reports by Unit Heatmap\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 50\":\"rgb(247,252,245)\",\"50 - 100\":\"rgb(199,233,192)\",\"100 - 150\":\"rgb(116,196,118)\",\"150 - 200\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "57e71030-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom reports by Lodging",
        "visState": "{\"title\":\"Symptom reports by Lodging\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":49997,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Symptoms\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Lodging\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 12\":\"rgb(247,252,245)\",\"12 - 23\":\"rgb(199,233,192)\",\"23 - 34\":\"rgb(116,196,118)\",\"34 - 45\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "fed0e760-e93a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Anxiety / Concern Monitoring",
        "visState": "{\"title\":\"Anxiety / Concern Monitoring\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":1,\"direction\":\"desc\"},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":10000,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"EDIPI\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Roster.firstName\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"First Name\"},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Roster.lastName\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Last Name\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.PhoneNumber\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Phone Number\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.Unit\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\"},\"hidden\":false},{\"id\":\"1\",\"enabled\":true,\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.TalkToSomeone\",\"customLabel\":\"Number of times asked to talk to someone\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":1,\"direction\":\"desc\"}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "40f18f20-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Units",
        "visState": "{\"title\":\"Total Units\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"_index\",\"customLabel\":\"Total Units\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "4b3ee1e0-e94c-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Recent Individuals at risk of COVID exposure",
        "visState": "{\"title\":\"Recent Individuals at risk of COVID exposure\",\"type\":\"table\",\"params\":{\"perPage\":20,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":3,\"direction\":\"asc\"},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"1\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.Symptoms\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\"},\"hidden\":false},{\"id\":\"9\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.Conditions\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Timestamp\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First\"},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"time_since_obs_hours\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Details.PhoneNumber.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Phone\"},\"hidden\":false},{\"id\":\"8\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":3,\"direction\":\"asc\"}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"meta\":{\"index\":\"52a6e670-f442-11ea-82b7-4bc5055cc562\",\"type\":\"phrases\",\"key\":\"Category.keyword\",\"value\":\"high, very_high\",\"params\":[\"high\",\"very_high\"],\"negate\":false,\"disabled\":false,\"alias\":null},\"query\":{\"bool\":{\"should\":[{\"match_phrase\":{\"Category.keyword\":\"high\"}},{\"match_phrase\":{\"Category.keyword\":\"very_high\"}}],\"minimum_should_match\":1}},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b1195610-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Servicemember symptoms report",
        "visState": "{\"title\":\"Servicemember symptoms report\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Observations with symptoms or conditions\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"filter\":{\"bool\":{\"should\":[{\"exists\":{\"field\":\"Details.Symptoms.keyword\"}},{\"exists\":{\"field\":\"Details.Conditions.keyword\"}}]}}}},\"meta\":{\"negate\":false,\"index\":\"9b3b4f90-e937-11ea-b481-91d592e28f0d\",\"disabled\":false,\"alias\":\"Conditions OR Symptoms Exist\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"filter\\\":{\\\"bool\\\":{\\\"should\\\":[{\\\"exists\\\":{\\\"field\\\":\\\"Details.Symptoms.keyword\\\"}},{\\\"exists\\\":{\\\"field\\\":\\\"Details.Conditions.keyword\\\"}}]}}}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "db29cdc0-2929-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Max Score Per Day",
        "visState": "{\"title\":\"Max Score Per Day\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Max Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Max Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"bottom\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\",\"customLabel\":\"Max Score\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"Date\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":50000000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "aded5c30-2854-11eb-8bde-57c4cf572790",
      "_type": "visualization",
      "_source": {
        "title": "Daily Symptoms",
        "visState": "{\"title\":\"Daily Symptoms\",\"type\":\"table\",\"params\":{\"perPage\":14,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":3,\"direction\":\"desc\"},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000000,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"EDIPI\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":true,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First Name\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":1,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":true,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last Name\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.Symptoms\",\"aggregate\":\"concat\",\"size\":5,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Symptoms\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\",\"customLabel\":\"Max Score\"},\"hidden\":false},{\"id\":\"9\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"bucket\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"Day\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":3,\"direction\":\"desc\"}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "8c85ee40-544b-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Muster timing",
        "visState": "{\"title\":\"Muster timing\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Muster.status.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bd1983b0-51f7-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Daily Muster Non-Compliance",
        "visState": "{\"title\":\"Daily Muster Non-Compliance\",\"type\":\"area\",\"params\":{\"type\":\"area\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"},\"valueAxis\":null},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"percentage\",\"defaultYExtents\":false},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Percentage\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"area\",\"mode\":\"stacked\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"drawLinesBetweenPoints\":true,\"showCircles\":true,\"interpolate\":\"linear\",\"valueAxis\":\"ValueAxis-1\"}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"group\",\"params\":{\"filters\":[{\"input\":{\"query\":\"Muster.reported: false\"},\"label\":\"Number NOT reporting\"},{\"input\":{\"query\":\"Muster.reported: true\"},\"label\":\"Number Reporting\"}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"colors\":{\"Number NOT reporting\":\"#E24D42\",\"Number Reporting\":\"#BADFF4\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "0df55b40-51eb-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Unit Muster Non-Compliance rate",
        "visState": "{\"title\":\"Unit Muster Non-Compliance rate\",\"type\":\"enhanced-table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\",\"computedColumns\":[{\"label\":\"Muster non-compliance rate\",\"formula\":\"col2 / col1\",\"format\":\"number\",\"pattern\":\"0,0%\",\"alignment\":\"left\",\"applyAlignmentOnTitle\":true,\"applyAlignmentOnTotal\":true,\"applyTemplate\":false,\"applyTemplateOnTotal\":true,\"template\":\"{{value}}\",\"enabled\":true}],\"computedColsPerSplitCol\":false,\"hideExportLinks\":false,\"showFilterBar\":false,\"filterCaseSensitive\":false,\"filterBarHideable\":false,\"filterAsYouType\":false,\"filterTermsSeparately\":false,\"filterHighlightResults\":false,\"filterBarWidth\":\"25%\",\"hiddenColumns\":\"1,2\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"splitcols\",\"params\":{\"filters\":[{\"input\":{\"query\":\"*\"},\"label\":\"\"},{\"input\":{\"query\":\"Muster.reported: false\"}}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f1a95bb0-eeb9-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Mental Health",
        "hits": 0,
        "description": "A dashboard for relevantly tracking the \"Talk to someone\" field from service member submissions.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":25,\"y\":0,\"w\":11,\"h\":17,\"i\":\"2\"},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":36,\"y\":0,\"w\":12,\"h\":17,\"i\":\"3\"},\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":16,\"y\":57,\"w\":32,\"h\":14,\"i\":\"4\"},\"id\":\"c95255a0-e93b-11ea-b481-91d592e28f0d\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":9,\"y\":32,\"w\":39,\"h\":15,\"i\":\"5\"},\"id\":\"fed0e760-e93a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"5\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":57,\"w\":16,\"h\":14,\"i\":\"7\"},\"id\":\"5c298f90-eecf-11ea-aec4-4103718388c0\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":12,\"y\":0,\"w\":13,\"h\":17,\"i\":\"8\"},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":12,\"h\":17,\"i\":\"9\"},\"id\":\"e25abde0-e94e-11ea-b481-91d592e28f0d\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":9,\"y\":17,\"w\":39,\"h\":15,\"i\":\"10\"},\"id\":\"4e827950-e93a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":17,\"w\":9,\"h\":30,\"i\":\"11\"},\"id\":\"e4dbae10-618c-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":47,\"w\":48,\"h\":10,\"i\":\"12\"},\"version\":\"6.4.1\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"id\":\"89db5d70-618d-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-14d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "3e5fd4d0-f445-11ea-82b7-4bc5055cc562",
      "_type": "dashboard",
      "_source": {
        "title": "Individual needs medical attention",
        "hits": 0,
        "description": "List of individuals at high risk of exposure to coronavirus based on their symptom submission",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"h\":31,\"i\":\"1\",\"w\":48,\"x\":0,\"y\":15},\"id\":\"4b3ee1e0-e94c-11ea-b481-91d592e28f0d\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"2\",\"w\":35,\"x\":0,\"y\":0},\"id\":\"7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"3\",\"w\":13,\"x\":35,\"y\":0},\"id\":\"29154300-4533-11eb-ad41-4d6b4e8c461f\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-24h",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "afcaefb0-253c-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Symptom Trending",
        "hits": 0,
        "description": "Trends of Symptoms and Individual Health Categories over time.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":31,\"y\":0,\"w\":17,\"h\":15,\"i\":\"2\"},\"id\":\"e292ffd0-2863-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"2\",\"title\":\"Filters\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":31,\"h\":15,\"i\":\"3\"},\"id\":\"179bb360-2865-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"3\",\"title\":\"Dashboard Description\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":30,\"w\":48,\"h\":17,\"i\":\"6\"},\"id\":\"12409630-29ee-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":15,\"w\":48,\"h\":15,\"i\":\"7\"},\"version\":\"6.4.1\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"id\":\"15be3790-618e-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-7d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "179bb360-2865-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom trending - Text - Base",
        "visState": "{\"title\":\"Symptom trending - Text - Base\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Symptom Trending\\nLine chart of symptoms trending over time.\\n\\nLine chart of the count of individuals in their respective categories over time.\\n\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 24 Hours\\\".\\n\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n\\n#### Individual Needs Medical Attention Line Chart\\nMulti-line graph where each line and color shows the number of symptoms observations received throughout the time window as specified by the time filter in 12-hour time intervals. Each line and color represents a specific symptom. You may filter out specific symptoms by clicking on the symptom name on the right side of the graph.\\n\\n#### Individuals by Category\\nThis is a multi-line graph depicting the number of observations across all units along with their corresponding \\\"category\\\" of coronavirus exposure risk based on the reported symptoms and conditions, in accordance with DDS's [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "15be3790-618e-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Symptom Trending Line Graph",
        "visState": "{\"title\":\"Symptom Trending Line Graph\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e4dbae10-618c-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Mental health tables explanation text",
        "visState": "{\"title\":\"Mental health tables explanation text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The tables to the right convey the following information:\\n#### Talk to Someone recency board\\n\\nA list of individuals who have indicated that they would like to talk to someone. Sort this list by the \\\"Last Timestamp\\\" column to bring the most recent individuals to the top.\\n\\n#### Anxiety / Concern Monitoring\\n\\nA list of individuals along with the total number of times they have asked to talk to someone. A higher number here may indicate a servicemember is in need of mental health attention or increased monitoring\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "89db5d70-618d-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Mental health graphs explanation",
        "visState": "{\"title\":\"Mental health graphs explanation\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The graphs below provide the following:\\n\\n\\n#### Cohort Anxiety / Concern\\n\\nThe total number of symptom observations indicating a need to talk to someone over time. This should serve as an indicator of overall mental health among a cohort of servicemembers.\\n\\n#### Talk to someone observation share\\n\\nThe total share of observations indicating a need to talk to someone versus those that made no indication. This gives an overall view of mental health of the cohort during the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e25abde0-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Mental Health Text",
        "visState": "{\"title\":\"Mental Health Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"Mental Health\\n---\\n\\n#### Control Board\\n\\nControls for selecting unit and lodging filters to be applied to the other visualizations\\n\\n#### Total Individuals\\nThe total number of unique individuals that have submitted observations\\n\\n#### Total Observations\\n\\nThe total number of symptom observations given within the specified time range\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "2f5db6e0-eeba-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Muster Non-Compliance",
        "hits": 0,
        "description": "A Dashboard for examining muster non-compliance across a cohort",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"2\",\"w\":8,\"x\":28,\"y\":0},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"9\",\"w\":13,\"x\":15,\"y\":0},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":29,\"i\":\"10\",\"w\":15,\"x\":0,\"y\":0},\"id\":\"82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"11\",\"w\":24,\"x\":0,\"y\":44},\"id\":\"bd1983b0-51f7-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":14,\"i\":\"12\",\"w\":33,\"x\":15,\"y\":15},\"id\":\"7fd3b4b0-51ea-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"13\",\"w\":12,\"x\":36,\"y\":0},\"id\":\"0df55b40-51eb-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"14\",\"w\":24,\"x\":24,\"y\":44},\"id\":\"8c85ee40-544b-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"15\",\"w\":48,\"x\":0,\"y\":29},\"id\":\"abab3d40-61a0-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-5y",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7fd3b4b0-51ea-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Servicemember Muster Non-Compliance Rate",
        "visState": "{\"title\":\"Servicemember Muster Non-Compliance Rate\",\"type\":\"enhanced-table\",\"params\":{\"computedColsPerSplitCol\":false,\"computedColumns\":[{\"label\":\"Muster non-compliance rate\",\"formula\":\"col5 / col4\",\"format\":\"number\",\"pattern\":\"0,0%\",\"alignment\":\"left\",\"applyAlignmentOnTitle\":true,\"applyAlignmentOnTotal\":true,\"applyTemplate\":false,\"applyTemplateOnTotal\":true,\"template\":\"{{value}}\",\"enabled\":true}],\"filterAsYouType\":false,\"filterBarHideable\":false,\"filterBarWidth\":\"25%\",\"filterCaseSensitive\":false,\"filterHighlightResults\":false,\"filterTermsSeparately\":false,\"hideExportLinks\":false,\"perPage\":10,\"showFilterBar\":false,\"showMetricsAtAllLevels\":false,\"showPartialRows\":false,\"showTotal\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"totalFunc\":\"sum\",\"hiddenColumns\":\"4,5\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"EDIPI\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First Name\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last Name\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.phone.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"splitcols\",\"params\":{\"filters\":[{\"input\":{\"query\":\"*\"},\"label\":\"\"},{\"input\":{\"query\":\"Muster.reported: false\"}}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Coronavirus At-risk Individuals Follow-Up Text",
        "visState": "{\"title\":\"Coronavirus At-risk Individuals Follow-Up Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Individual needs medical attention\\nList of individuals at high risk of exposure to coronavirus based on their symptom submission.\\n\\\"**At-risk**\\\" is defined as any individual whose combination of reported symptoms, conditions, and temperature results in a categorization of \\\"high\\\" or \\\"very_high\\\" risk of coronavirus exposure in accordance with DDS's [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 24 Hours\\\".\\n#### Recent Individuals at Risk of COVID-19 Exposure\\nA filtered table that shows the reporting status of only individuals who are deemed at risk for COVID-19 exposure. Each row in the table shows the EDIPI, score, risk exposure by category, date and time of last observation, temperature and the number of hours since the last observation.  You may sort by any of the columns.\\nIf an individual submits symptoms multiple times within the time period, this table displays the most recent data.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "abab3d40-61a0-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Muster non-compliance graph text",
        "visState": "{\"title\":\"Muster non-compliance graph text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The graphs below provide the following information:\\n\\n#### Daily Muster Non-Compliance\\nA graph showing muster compliance on a daily basis for the given time period and filters. If a very long time period such as years is selected, the graph will aggregate over longer segments of time than a day.\\n\\n#### Muster Timing\\nA multi-line graph showing the general timing of muster reports by individuals.\\n- *Early* - The report was provided **before** the appointed muster time-window.\\n- *Late* - The report was provided **after** the appointed muster time-window.\\n- *On-time* - The report was provided **during** the appointed muster time-window.\\n- *Non-Reporting* - **No report was provided** any time within the vicinity of the muster time-window, defined as the halfway point between the close of one muster reporting time-window and the beginning of another.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Muster Compliance Text",
        "visState": "{\"title\":\"Muster Compliance Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Muster Non-Compliance\\nA dashboard supplying various ways of examining muster non-compliance across a cohort.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Individuals\\nThe total number of individuals who reported symptoms.\\n#### Unit Muster Non-Compliance Rate\\nA table of units along with the percentage of times individuals in the unit did not report during muster for the given time period.\\n#### Servicemember Muster Non-Compliance Rate\\nA table of individuals along with the percentage of times that they have not reported during muster for the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom Tracking Text",
        "visState": "{\"title\":\"Health / Symptom Tracking Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Health / Symptom Tracking\\nA dashboard for tracking servicemember symptoms and coronavirus exposure potential\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of symptoms observations. \\n#### Total Individuals\\nThe total number of individuals who reported symptoms.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "061fb350-eeba-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Health / Symptom Tracking",
        "hits": 0,
        "description": "A dashboard for tracking soldier symptoms and coronavirus exposure potential",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":79,\"w\":34,\"h\":12,\"i\":\"1\"},\"id\":\"4fef2150-e93d-11ea-b481-91d592e28f0d\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":67,\"w\":34,\"h\":12,\"i\":\"2\"},\"id\":\"354112d0-e93f-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":21,\"y\":12,\"w\":27,\"h\":8,\"i\":\"4\"},\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":35,\"y\":0,\"w\":13,\"h\":12,\"i\":\"6\"},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":52,\"w\":24,\"h\":15,\"i\":\"7\"},\"id\":\"b1195610-e94e-11ea-b481-91d592e28f0d\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":123,\"w\":24,\"h\":46,\"i\":\"8\"},\"id\":\"d3be0d70-eec4-11ea-aec4-4103718388c0\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":123,\"w\":24,\"h\":46,\"i\":\"9\"},\"id\":\"ebe2c2e0-eecb-11ea-aec4-4103718388c0\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":108,\"w\":24,\"h\":15,\"i\":\"10\"},\"id\":\"783c2c90-eecc-11ea-aec4-4103718388c0\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":108,\"w\":24,\"h\":15,\"i\":\"11\"},\"id\":\"b1526e90-eecc-11ea-aec4-4103718388c0\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":37,\"w\":24,\"h\":15,\"i\":\"12\"},\"id\":\"308b9ce0-e946-11ea-b481-91d592e28f0d\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":37,\"w\":24,\"h\":15,\"i\":\"13\"},\"id\":\"496c5380-e946-11ea-b481-91d592e28f0d\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":21,\"y\":0,\"w\":14,\"h\":12,\"i\":\"14\"},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":21,\"h\":20,\"i\":\"15\"},\"id\":\"1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":20,\"w\":48,\"h\":17,\"i\":\"16\"},\"id\":\"55ae0f90-61a9-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"16\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":52,\"w\":24,\"h\":15,\"i\":\"17\"},\"id\":\"bf289fd0-61a9-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"17\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":67,\"w\":14,\"h\":24,\"i\":\"18\"},\"id\":\"cb8f07b0-61b7-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"18\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":91,\"w\":48,\"h\":17,\"i\":\"20\"},\"version\":\"6.4.1\",\"panelIndex\":\"20\",\"type\":\"visualization\",\"id\":\"b79376a0-61bd-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-7d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "01bd38c0-229d-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Conditions reported by Unit",
        "visState": "{\"title\":\"Total Conditions reported by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Total conditions reported\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Total conditions reported\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total conditions reported\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bf289fd0-61a9-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Unit Symptom Health",
        "visState": "{\"title\":\"Unit Symptom Health\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Observations with symptoms or conditions\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"filter\":{\"bool\":{\"should\":[{\"exists\":{\"field\":\"Details.Symptoms.keyword\"}},{\"exists\":{\"field\":\"Details.Conditions.keyword\"}}]}}}},\"meta\":{\"negate\":false,\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"disabled\":false,\"alias\":\"Conditions OR Symptoms Exist\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"filter\\\":{\\\"bool\\\":{\\\"should\\\":[{\\\"exists\\\":{\\\"field\\\":\\\"Details.Symptoms.keyword\\\"}},{\\\"exists\\\":{\\\"field\\\":\\\"Details.Conditions.keyword\\\"}}]}}}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b79376a0-61bd-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom lodging text",
        "visState": "{\"title\":\"Health / Symptom lodging text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following graphs below all provide information related to health and symptoms across lodging. **If such a variable does not make sense for your situation, e.g. you operate on a ship, then you can safely ignore these graphs**. They provide the following information:\\n\\n#### Cohort Symptom and Condition Prevalence by Lodging\\nProvides the average risk score of observations by lodging\\n\\n#### Cohort At-risk Individual Count by Lodging\\nProvides the number of at-risk observations per lodging.  An \\\"at-risk\\\" observation is one in which the risk category is \\\"high\\\" or \\\"very high\\\" as determined by the DDS coronavirus calculator.\\n\\n#### Symptom Prevalence by Lodging\\nA graph providing the number of observations containing given symptoms by lodging. Note that symptoms are provided as a list. A single observation may have multiple concurrent symptoms.\\n\\n#### Condition Prevalence by Lodging\\nA graph providing the number of observations containing given conditions by lodging. Note that conditions are provided as a list. A single observation may have multiple concurrent symptoms.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cb8f07b0-61b7-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptoms risk explanation",
        "visState": "{\"title\":\"Health / Symptoms risk explanation\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The two graphs on the right convey concepts related to individuals' risk of coronavirus exposure. Details of the  used to produce Documentation for the scores and categories used by these graphs can be found in the [DDS created coronavirus calculator](https://github.com/deptofdefense/covid19-calculator). The graphs convey the following:\\n\\n#### Cohort Symptom and Condition prevalence\\nA line graph conveying the average coronavirus risk score of the cohort over the specified time period. For an individual report, a risk score over 40 would be considered 'high' and a risk score over 70 would be considered 'very high'.\\n\\n#### Cohort Coronavirus Risk\\nA multi-line graph providing counts of observations by coronavirus risk category, as defined by DDS's coronavirus risk calculator, over the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5902bef0-6250-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health risk symptom text",
        "visState": "{\"title\":\"Force health risk symptom text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The four graphs below convey the following:\\n\\n#### Average Risk Score\\nThe average risk score of the cohort for the given time period. For individual observations, a score of 40 or higher would be classified as 'high' risk, and a score of '70' or higher would be classified as 'very high' risk.\\n\\n#### Individuals per Risk Category\\nA line graph providing the number of observations belonging to each category of coronavirus exposure risk as determined according to [DDS's coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Symptom Tracking\\nThe numbers of given symptoms reported in a particular time period. Note that single observations can contain multiple symptoms.\\n\\n#### Condition Tracking\\nThe numbers of given conditions reported in a particular time period. Note that single observations can contain multiple conditions.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "9bf611c0-6251-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health unit summary graphs text",
        "visState": "{\"title\":\"Force health unit summary graphs text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The following three graphs below and to the right provide risk metrics on a per unit basis:\\n\\n#### At-risk Individuals by Unit\\nThe total number of observations that are 'at-risk' from a given unit over a given time period. An 'at-risk' observation is one that is classified as 'high' or 'very high' risk by the [DDS coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Total Symptoms reported by Unit\\nThe total number of observations containing symptoms coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\\n\\n#### Total Conditions reported by Unit\\nThe total number of observations containing conditions coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b5c163d0-61bf-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force Health Dashboard Intro text",
        "visState": "{\"title\":\"Force Health Dashboard Intro text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"# Force Health Dashboard\\nThis dashboard provides a number of visualizations related to examining and exploring force health.\\n\\n#### Health Control Board\\nA set of controls for setting filters on unit, lodging, symptoms, or conditions. Choose apply changes to change the filters.\\n\\n#### Total Individuals\\nThe total number of individuals making up the cohort under examination.\\n\\n#### Total Units\\nThe total number of units represented by individuals making up the cohort under examination.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a2f3d060-6252-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health heatmaps text",
        "visState": "{\"title\":\"Force health heatmaps text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following four heat maps provide a breakdown of particular symptom and condition prevalence across units and lodgings. These visualizations can be useful for examining potential \\\"hot-spots\\\" of symptoms / conditions linked either to units or lodging over the course of a period of time. If the concept of lodging does not make sense for your situation, e.g. you operate on a ship, then you may safely ignore the heatmaps related to lodging:\\n\\n#### Symptom reports by Unit Heatmap\\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-symptom basis.\\n\\n\\n#### Condition reports by Unit Heatmap \\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-condition basis.\\n\\n#### Symptom reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-symptom basis.\\n\\n#### Condition reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-condition basis.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c3644b10-229a-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Force Health",
        "hits": 0,
        "description": "Monitoring overall health of the force",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":38,\"y\":0,\"w\":10,\"h\":21,\"i\":\"2\"},\"id\":\"40f18f20-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":50,\"w\":24,\"h\":12,\"i\":\"3\"},\"id\":\"b976ad90-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":78,\"w\":24,\"h\":15,\"i\":\"4\"},\"id\":\"f4b06bd0-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":0,\"w\":13,\"h\":21,\"i\":\"5\"},\"id\":\"6f708620-229c-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"5\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":50,\"w\":24,\"h\":12,\"i\":\"6\"},\"id\":\"c39b0090-229c-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":78,\"w\":24,\"h\":15,\"i\":\"7\"},\"id\":\"01bd38c0-229d-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":111,\"w\":24,\"h\":19,\"i\":\"8\"},\"id\":\"a0eeda70-229d-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":111,\"w\":24,\"h\":19,\"i\":\"9\"},\"id\":\"1885c850-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":130,\"w\":24,\"h\":15,\"i\":\"10\"},\"id\":\"57e71030-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":130,\"w\":24,\"h\":15,\"i\":\"11\"},\"id\":\"7afa6720-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":37,\"w\":24,\"h\":13,\"i\":\"12\"},\"id\":\"e2e816d0-29e6-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":37,\"w\":24,\"h\":13,\"i\":\"13\"},\"id\":\"8e685260-2a94-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":62,\"w\":24,\"h\":16,\"i\":\"14\"},\"id\":\"800b9af0-2a95-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":14,\"h\":21,\"i\":\"15\"},\"id\":\"b5c163d0-61bf-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":27,\"y\":0,\"w\":11,\"h\":21,\"i\":\"16\"},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"16\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":21,\"w\":48,\"h\":16,\"i\":\"17\"},\"id\":\"5902bef0-6250-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"17\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":62,\"w\":24,\"h\":16,\"i\":\"18\"},\"id\":\"9bf611c0-6251-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"18\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":93,\"w\":48,\"h\":18,\"i\":\"19\"},\"version\":\"6.4.1\",\"panelIndex\":\"19\",\"type\":\"visualization\",\"id\":\"a2f3d060-6252-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-14d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1fc60b10-292a-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Med Health Agg Report MD",
        "visState": "{\"title\":\"Med Health Agg Report MD\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"# Individual Symptom Trending\\n\\nThis dashboard is meant to help with examine individual servicemember's historic symptoms and coronavirus exposure potential. **Warning: The graphs and tables will generally not be useful until a filter for an individual servicemember is added.**\\n\\n#### Time Filter\\n\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 14 days\\\".\\n\\n#### Control Board\\n\\nFilter by EDIPI. All sections below will use the time and EDIPI filters.\\n\\n#### Daily Symptoms\\n\\nA table with a row for each date showing the symptoms that the person had each day along with their max score.\\n\\n#### Max Score per Day\\n\\nA visual line graph of the maximum score per day for each person.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5e9273a0-29f3-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Individual Symptom Trending",
        "hits": 0,
        "description": "Individuals Symptoms Over Time",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"1\",\"w\":32,\"x\":0,\"y\":0},\"id\":\"1fc60b10-292a-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"2\",\"w\":16,\"x\":32,\"y\":0},\"id\":\"78114120-2855-11eb-8bde-57c4cf572790\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":3,\"direction\":\"desc\"}}}},\"gridData\":{\"h\":19,\"i\":\"4\",\"w\":48,\"x\":0,\"y\":15},\"id\":\"aded5c30-2854-11eb-8bde-57c4cf572790\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":19,\"i\":\"5\",\"w\":48,\"x\":0,\"y\":34},\"id\":\"db29cdc0-2929-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"5\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-30d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[{\"$state\":{\"store\":\"appState\"},\"meta\":{\"alias\":null,\"controlledBy\":\"1605799680710\",\"disabled\":false,\"index\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"key\":\"Roster.firstName.keyword\",\"negate\":false,\"params\":{\"query\":\"Brian\",\"type\":\"phrase\"},\"type\":\"phrase\",\"value\":\"Brian\"},\"query\":{\"match\":{\"Roster.firstName.keyword\":{\"query\":\"Brian\",\"type\":\"phrase\"}}}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "55ae0f90-61a9-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom symptom graph text",
        "visState": "{\"title\":\"Health / Symptom symptom graph text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following four graphs below convey the following:\\n\\n#### Symptom Share\\nThe percentage share of symptoms from all observations reporting symptoms in the given time period. Keep in mind that individual observations can have multiple symptoms.\\n#### Condition Share\\nThe percentage share of all conditions from all observations reporting conditions in the given time period. Keep in mind that individual observations can have multiple conditions.\\n#### Servicemember symptom report\\nA table that shows the number of observations received where the individual reported symptoms or conditions.  You may sort by EDIPI or Observations with symptoms or conditions.\\n#### Unit Symptom health\\nA table that shows the number of observations received on a per unit basis where the individual reported symptoms or conditions.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "29154300-4533-11eb-ad41-4d6b4e8c461f",
      "_type": "visualization",
      "_source": {
        "title": "Controls - Unit Selector",
        "visState": "{\"title\":\"Controls - Unit Selector\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1608737092395\",\"indexPattern\":\"a8de1010-2532-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    }
  ],
  pii: [
    {
      "_id": "0aa4c0d0-f44d-11ea-82b7-4bc5055cc562",
      "_type": "index-pattern",
      "_source": {
        "title": "*",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Age\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Age.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Sp02Percent\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.firstName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "0767d120-2367-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-health",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a7194d00-2850-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-reports",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.durationMinutes\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.endTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.id.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.reported\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTime\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.startTime.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.timezone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.timezone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.advancedParty\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.aircrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.billetWorkcenter\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.billetWorkcenter.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdi\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdqar\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.contractNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.contractNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.covid19TestReturnDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dept\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.dept.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.div\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.div.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dscacrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.edipi.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.firstName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.firstName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.lastName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastReported\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.phone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.phone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pilot\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pui\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rate\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rate.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rateRank\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rateRank.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rom.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.romRelease\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.romRelease.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.traveler_or_contact\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.traveler_or_contact.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.undefined\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.undefined.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c9198a80-2514-11eb-aa43-cf97fefcff0e",
      "_type": "search",
      "_source": {
        "title": "Alert - User Needs Medical Attention - Base",
        "description": "",
        "hits": 0,
        "columns": [
          "Roster.unit",
          "Category",
          "Details.TemperatureFahrenheit",
          "Details.TalkToSomeone",
          "Score"
        ],
        "sort": [
          "Timestamp",
          "desc"
        ],
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"highlightAll\":true,\"version\":true,\"query\":{\"language\":\"kuery\",\"query\":\"(Category.keyword  :  \\\"very high\\\" ) or (Category.keyword  : \\\"high\\\" ) or (Category.keyword : \\\"medium\\\" ) or (Details.TemperatureFahrenheit >= 102) or (Details.TalkToSomeone :  1)\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c3644b10-229a-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Force Health",
        "hits": 0,
        "description": "Monitoring overall health of the force",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":38,\"y\":0,\"w\":10,\"h\":21,\"i\":\"2\"},\"id\":\"40f18f20-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":50,\"w\":24,\"h\":12,\"i\":\"3\"},\"id\":\"b976ad90-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":78,\"w\":24,\"h\":15,\"i\":\"4\"},\"id\":\"f4b06bd0-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":0,\"w\":13,\"h\":21,\"i\":\"5\"},\"id\":\"6f708620-229c-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"5\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":50,\"w\":24,\"h\":12,\"i\":\"6\"},\"id\":\"c39b0090-229c-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":78,\"w\":24,\"h\":15,\"i\":\"7\"},\"id\":\"01bd38c0-229d-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":111,\"w\":24,\"h\":19,\"i\":\"8\"},\"id\":\"a0eeda70-229d-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":111,\"w\":24,\"h\":19,\"i\":\"9\"},\"id\":\"1885c850-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":130,\"w\":24,\"h\":15,\"i\":\"10\"},\"id\":\"57e71030-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":130,\"w\":24,\"h\":15,\"i\":\"11\"},\"id\":\"7afa6720-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":37,\"w\":24,\"h\":13,\"i\":\"12\"},\"id\":\"e2e816d0-29e6-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":37,\"w\":24,\"h\":13,\"i\":\"13\"},\"id\":\"8e685260-2a94-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":62,\"w\":24,\"h\":16,\"i\":\"14\"},\"id\":\"800b9af0-2a95-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":14,\"h\":21,\"i\":\"15\"},\"id\":\"b5c163d0-61bf-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":27,\"y\":0,\"w\":11,\"h\":21,\"i\":\"16\"},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"16\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":21,\"w\":48,\"h\":16,\"i\":\"17\"},\"id\":\"5902bef0-6250-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"17\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":62,\"w\":24,\"h\":16,\"i\":\"18\"},\"id\":\"9bf611c0-6251-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"18\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":93,\"w\":48,\"h\":18,\"i\":\"19\"},\"version\":\"6.4.1\",\"panelIndex\":\"19\",\"type\":\"visualization\",\"id\":\"a2f3d060-6252-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-14d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e292ffd0-2863-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Alert - Control Board - Base",
        "visState": "{\"title\":\"Alert - Control Board - Base\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1599843098242\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1599843111344\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605806664606\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Symptoms.keyword\",\"parent\":\"\",\"label\":\"Symptoms - Select all that apply (no selection implies all symptoms)\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Muster List Text",
        "visState": "{\"title\":\"Muster List Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Muster List\\nList of individuals with the last time they submitted an observation.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Soldier Observation Follow-up\\nA table that displays when the last time an individual submitted a symptoms observation report. Each row in the table shows the EDIPI, the individual's phone number, name, lodging, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the three columns.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f4558e30-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Coronavirus Health Text",
        "visState": "{\"title\":\"Coronavirus Health Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":24,\"openLinksInNewTab\":false,\"markdown\":\"Coronavirus Exposure / Symptoms\\n---\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "6f708620-229c-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Health control board",
        "visState": "{\"title\":\"Health control board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1604933946497\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933991588\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933914012\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Symptoms.keyword\",\"parent\":\"\",\"label\":\"Symptoms\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933973627\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Conditions.keyword\",\"parent\":\"\",\"label\":\"Conditions\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1c7a8120-f446-11ea-82b7-4bc5055cc562",
      "_type": "dashboard",
      "_source": {
        "title": "Muster List",
        "hits": 0,
        "description": "List of individuals with the last time they submitted an observation.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":15,\"w\":48,\"h\":31,\"i\":\"1\"},\"id\":\"bbabdb50-eecd-11ea-aec4-4103718388c0\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":48,\"h\":15,\"i\":\"2\"},\"id\":\"cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-24h",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "afcaefb0-253c-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Symptom Trending",
        "hits": 0,
        "description": "Trends of Symptoms and Individual Health Categories over time.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":31,\"y\":0,\"w\":17,\"h\":15,\"i\":\"2\"},\"id\":\"e292ffd0-2863-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"2\",\"title\":\"Filters\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":31,\"h\":15,\"i\":\"3\"},\"id\":\"179bb360-2865-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"3\",\"title\":\"Dashboard Description\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":30,\"w\":48,\"h\":17,\"i\":\"6\"},\"id\":\"12409630-29ee-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":15,\"w\":48,\"h\":15,\"i\":\"7\"},\"version\":\"6.4.1\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"id\":\"15be3790-618e-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-7d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "2f5db6e0-eeba-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Muster Non-Compliance",
        "hits": 0,
        "description": "A Dashboard for examining muster non-compliance across a cohort",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"2\",\"w\":8,\"x\":28,\"y\":0},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"9\",\"w\":13,\"x\":15,\"y\":0},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":29,\"i\":\"10\",\"w\":15,\"x\":0,\"y\":0},\"id\":\"82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"11\",\"w\":24,\"x\":0,\"y\":44},\"id\":\"bd1983b0-51f7-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":14,\"i\":\"12\",\"w\":33,\"x\":15,\"y\":15},\"id\":\"7fd3b4b0-51ea-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"13\",\"w\":12,\"x\":36,\"y\":0},\"id\":\"0df55b40-51eb-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"14\",\"w\":24,\"x\":24,\"y\":44},\"id\":\"8c85ee40-544b-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"15\",\"w\":48,\"x\":0,\"y\":29},\"id\":\"abab3d40-61a0-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-5y",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e25abde0-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Mental Health Text",
        "visState": "{\"title\":\"Mental Health Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"Mental Health\\n---\\n\\n#### Control Board\\n\\nControls for selecting unit and lodging filters to be applied to the other visualizations\\n\\n#### Total Individuals\\nThe total number of unique individuals that have submitted observations\\n\\n#### Total Observations\\n\\nThe total number of symptom observations given within the specified time range\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Muster Compliance Text",
        "visState": "{\"title\":\"Muster Compliance Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Muster Non-Compliance\\nA dashboard supplying various ways of examining muster non-compliance across a cohort.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Individuals\\nThe total number of individuals who reported symptoms.\\n#### Unit Muster Non-Compliance Rate\\nA table of units along with the percentage of times individuals in the unit did not report during muster for the given time period.\\n#### Servicemember Muster Non-Compliance Rate\\nA table of individuals along with the percentage of times that they have not reported during muster for the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Coronavirus At-risk Individuals Follow-Up Text",
        "visState": "{\"title\":\"Coronavirus At-risk Individuals Follow-Up Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Individual needs medical attention\\nList of individuals at high risk of exposure to coronavirus based on their symptom submission.\\n\\\"**At-risk**\\\" is defined as any individual whose combination of reported symptoms, conditions, and temperature results in a categorization of \\\"high\\\" or \\\"very_high\\\" risk of coronavirus exposure in accordance with DDS's [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 24 Hours\\\".\\n#### Recent Individuals at Risk of COVID-19 Exposure\\nA filtered table that shows the reporting status of only individuals who are deemed at risk for COVID-19 exposure. Each row in the table shows the EDIPI, score, risk exposure by category, date and time of last observation, temperature and the number of hours since the last observation.  You may sort by any of the columns.\\nIf an individual submits symptoms multiple times within the time period, this table displays the most recent data.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "abab3d40-61a0-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Muster non-compliance graph text",
        "visState": "{\"title\":\"Muster non-compliance graph text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The graphs below provide the following information:\\n\\n#### Daily Muster Non-Compliance\\nA graph showing muster compliance on a daily basis for the given time period and filters. If a very long time period such as years is selected, the graph will aggregate over longer segments of time than a day.\\n\\n#### Muster Timing\\nA multi-line graph showing the general timing of muster reports by individuals.\\n- *Early* - The report was provided **before** the appointed muster time-window.\\n- *Late* - The report was provided **after** the appointed muster time-window.\\n- *On-time* - The report was provided **during** the appointed muster time-window.\\n- *Non-Reporting* - **No report was provided** any time within the vicinity of the muster time-window, defined as the halfway point between the close of one muster reporting time-window and the beginning of another.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "78114120-2855-11eb-8bde-57c4cf572790",
      "_type": "visualization",
      "_source": {
        "title": "Medical Health Aggregation Control Board",
        "visState": "{\"title\":\"Medical Health Aggregation Control Board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1605563290045\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"EDIPI.keyword\",\"parent\":\"\",\"label\":\"EDIPI\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":false,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605799680710\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.firstName.keyword\",\"parent\":\"\",\"label\":\"First\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605799712742\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.lastName.keyword\",\"parent\":\"\",\"label\":\"Last\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "29154300-4533-11eb-ad41-4d6b4e8c461f",
      "_type": "visualization",
      "_source": {
        "title": "Controls - Unit Selector",
        "visState": "{\"title\":\"Controls - Unit Selector\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1608737092395\",\"indexPattern\":\"1fe23f40-2440-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "179bb360-2865-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom trending - Text - Base",
        "visState": "{\"title\":\"Symptom trending - Text - Base\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Symptom Trending\\nLine chart of symptoms trending over time.\\n\\nLine chart of the count of individuals in their respective categories over time.\\n\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 24 Hours\\\".\\n\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n\\n#### Individual Needs Medical Attention Line Chart\\nMulti-line graph where each line and color shows the number of symptoms observations received throughout the time window as specified by the time filter in 12-hour time intervals. Each line and color represents a specific symptom. You may filter out specific symptoms by clicking on the symptom name on the right side of the graph.\\n\\n#### Individuals by Category\\nThis is a multi-line graph depicting the number of observations across all units along with their corresponding \\\"category\\\" of coronavirus exposure risk based on the reported symptoms and conditions, in accordance with DDS's [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "353451a0-f8e2-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Individuals That Would Like to Talk to Someone Text",
        "visState": "{\"title\":\"Individuals That Would Like to Talk to Someone Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Individuals That Would Like to Talk to Someone\\nList of individuals that indicated they \\\"would like to talk someone\\\" in their submission\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Talk To Someone Recency Board\\nA table that shows all individuals who want to talk to someone. Each row in the table shows the EDIPI, name, phone, lodging, unit, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the columns.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "18aa2a20-f444-11ea-82b7-4bc5055cc562",
      "_type": "visualization",
      "_source": {
        "title": "Control Board",
        "visState": "{\"title\":\"Control Board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1599843098242\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1599843111344\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e4dbae10-618c-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Mental health tables explanation text",
        "visState": "{\"title\":\"Mental health tables explanation text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The tables to the right convey the following information:\\n#### Talk to Someone recency board\\n\\nA list of individuals who have indicated that they would like to talk to someone. Sort this list by the \\\"Last Timestamp\\\" column to bring the most recent individuals to the top.\\n\\n#### Anxiety / Concern Monitoring\\n\\nA list of individuals along with the total number of times they have asked to talk to someone. A higher number here may indicate a servicemember is in need of mental health attention or increased monitoring\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "89db5d70-618d-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Mental health graphs explanation",
        "visState": "{\"title\":\"Mental health graphs explanation\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The graphs below provide the following:\\n\\n\\n#### Cohort Anxiety / Concern\\n\\nThe total number of symptom observations indicating a need to talk to someone over time. This should serve as an indicator of overall mental health among a cohort of servicemembers.\\n\\n#### Talk to someone observation share\\n\\nThe total share of observations indicating a need to talk to someone versus those that made no indication. This gives an overall view of mental health of the cohort during the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "09c49db0-e94f-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Data Quality Issues Text",
        "visState": "{\"title\":\"Data Quality Issues Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":24,\"openLinksInNewTab\":false,\"markdown\":\"Data Quality / Issues\\n---\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a2f3d060-6252-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health heatmaps text",
        "visState": "{\"title\":\"Force health heatmaps text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following four heat maps provide a breakdown of particular symptom and condition prevalence across units and lodgings. These visualizations can be useful for examining potential \\\"hot-spots\\\" of symptoms / conditions linked either to units or lodging over the course of a period of time. If the concept of lodging does not make sense for your situation, e.g. you operate on a ship, then you may safely ignore the heatmaps related to lodging:\\n\\n#### Symptom reports by Unit Heatmap\\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-symptom basis.\\n\\n\\n#### Condition reports by Unit Heatmap \\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-condition basis.\\n\\n#### Symptom reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-symptom basis.\\n\\n#### Condition reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-condition basis.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "308b9ce0-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Condition Share",
        "visState": "{\"title\":\"Condition Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1fc60b10-292a-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Med Health Agg Report MD",
        "visState": "{\"title\":\"Med Health Agg Report MD\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"# Individual Symptom Trending\\n\\nThis dashboard is meant to help with examine individual servicemember's historic symptoms and coronavirus exposure potential. **Warning: The graphs and tables will generally not be useful until a filter for an individual servicemember is added.**\\n\\n#### Time Filter\\n\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 14 days\\\".\\n\\n#### Control Board\\n\\nFilter by EDIPI. All sections below will use the time and EDIPI filters.\\n\\n#### Daily Symptoms\\n\\nA table with a row for each date showing the symptoms that the person had each day along with their max score.\\n\\n#### Max Score per Day\\n\\nA visual line graph of the maximum score per day for each person.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "496c5380-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Symptom Share",
        "visState": "{\"title\":\"Symptom Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "91ed9950-eecf-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Observations over time by Lodging",
        "visState": "{\"title\":\"Observations over time by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "800b9af0-2a95-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "At-risk individuals by Unit",
        "visState": "{\"title\":\"At-risk individuals by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"should\":[{\"terms\":{\"Category.keyword\":[\"very high\",\"high\"]}},{\"bool\":{\"must\":[{\"term\":{\"Category.keyword\":\"medium\"}},{\"range\":{\"Details.TemperatureFahrenheit\":{\"gte\":102}}}]}}]}},\"meta\":{\"negate\":false,\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"disabled\":false,\"alias\":\"v. high, high, or (medium and temp >= 102)\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"should\\\":[{\\\"terms\\\":{\\\"Category.keyword\\\":[\\\"very high\\\",\\\"high\\\"]}},{\\\"bool\\\":{\\\"must\\\":[{\\\"term\\\":{\\\"Category.keyword\\\":\\\"medium\\\"}},{\\\"range\\\":{\\\"Details.TemperatureFahrenheit\\\":{\\\"gte\\\":102}}}]}}]}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "57e71030-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom reports by Lodging",
        "visState": "{\"title\":\"Symptom reports by Lodging\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":49997,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Symptoms\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Lodging\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 12\":\"rgb(247,252,245)\",\"12 - 23\":\"rgb(199,233,192)\",\"23 - 34\":\"rgb(116,196,118)\",\"34 - 45\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "0df55b40-51eb-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Unit Muster Non-Compliance rate",
        "visState": "{\"title\":\"Unit Muster Non-Compliance rate\",\"type\":\"enhanced-table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\",\"computedColumns\":[{\"label\":\"Muster non-compliance rate\",\"formula\":\"col2 / col1\",\"format\":\"number\",\"pattern\":\"0,0%\",\"alignment\":\"left\",\"applyAlignmentOnTitle\":true,\"applyAlignmentOnTotal\":true,\"applyTemplate\":false,\"applyTemplateOnTotal\":true,\"template\":\"{{value}}\",\"enabled\":true}],\"computedColsPerSplitCol\":false,\"hideExportLinks\":false,\"showFilterBar\":false,\"filterCaseSensitive\":false,\"filterBarHideable\":false,\"filterAsYouType\":false,\"filterTermsSeparately\":false,\"filterHighlightResults\":false,\"filterBarWidth\":\"25%\",\"hiddenColumns\":\"1,2\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"splitcols\",\"params\":{\"filters\":[{\"input\":{\"query\":\"*\"},\"label\":\"\"},{\"input\":{\"query\":\"Muster.reported: false\"}}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bd1983b0-51f7-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Daily Muster Non-Compliance",
        "visState": "{\"title\":\"Daily Muster Non-Compliance\",\"type\":\"area\",\"params\":{\"type\":\"area\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"},\"valueAxis\":null},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"percentage\",\"defaultYExtents\":false},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Percentage\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"area\",\"mode\":\"stacked\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"drawLinesBetweenPoints\":true,\"showCircles\":true,\"interpolate\":\"linear\",\"valueAxis\":\"ValueAxis-1\"}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"group\",\"params\":{\"filters\":[{\"input\":{\"query\":\"Muster.reported: false\"},\"label\":\"Number NOT reporting\"},{\"input\":{\"query\":\"Muster.reported: true\"},\"label\":\"Number Reporting\"}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"colors\":{\"Number NOT reporting\":\"#E24D42\",\"Number Reporting\":\"#BADFF4\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom Tracking Text",
        "visState": "{\"title\":\"Health / Symptom Tracking Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Health / Symptom Tracking\\nA dashboard for tracking servicemember symptoms and coronavirus exposure potential\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of symptoms observations. \\n#### Total Individuals\\nThe total number of individuals who reported symptoms.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b79376a0-61bd-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom lodging text",
        "visState": "{\"title\":\"Health / Symptom lodging text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following graphs below all provide information related to health and symptoms across lodging. **If such a variable does not make sense for your situation, e.g. you operate on a ship, then you can safely ignore these graphs**. They provide the following information:\\n\\n#### Cohort Symptom and Condition Prevalence by Lodging\\nProvides the average risk score of observations by lodging\\n\\n#### Cohort At-risk Individual Count by Lodging\\nProvides the number of at-risk observations per lodging.  An \\\"at-risk\\\" observation is one in which the risk category is \\\"high\\\" or \\\"very high\\\" as determined by the DDS coronavirus calculator.\\n\\n#### Symptom Prevalence by Lodging\\nA graph providing the number of observations containing given symptoms by lodging. Note that symptoms are provided as a list. A single observation may have multiple concurrent symptoms.\\n\\n#### Condition Prevalence by Lodging\\nA graph providing the number of observations containing given conditions by lodging. Note that conditions are provided as a list. A single observation may have multiple concurrent symptoms.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b5c163d0-61bf-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force Health Dashboard Intro text",
        "visState": "{\"title\":\"Force Health Dashboard Intro text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"# Force Health Dashboard\\nThis dashboard provides a number of visualizations related to examining and exploring force health.\\n\\n#### Health Control Board\\nA set of controls for setting filters on unit, lodging, symptoms, or conditions. Choose apply changes to change the filters.\\n\\n#### Total Individuals\\nThe total number of individuals making up the cohort under examination.\\n\\n#### Total Units\\nThe total number of units represented by individuals making up the cohort under examination.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5902bef0-6250-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health risk symptom text",
        "visState": "{\"title\":\"Force health risk symptom text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The four graphs below convey the following:\\n\\n#### Average Risk Score\\nThe average risk score of the cohort for the given time period. For individual observations, a score of 40 or higher would be classified as 'high' risk, and a score of '70' or higher would be classified as 'very high' risk.\\n\\n#### Individuals per Risk Category\\nA line graph providing the number of observations belonging to each category of coronavirus exposure risk as determined according to [DDS's coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Symptom Tracking\\nThe numbers of given symptoms reported in a particular time period. Note that single observations can contain multiple symptoms.\\n\\n#### Condition Tracking\\nThe numbers of given conditions reported in a particular time period. Note that single observations can contain multiple conditions.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cb8f07b0-61b7-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptoms risk explanation",
        "visState": "{\"title\":\"Health / Symptoms risk explanation\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The two graphs on the right convey concepts related to individuals' risk of coronavirus exposure. Details of the  used to produce Documentation for the scores and categories used by these graphs can be found in the [DDS created coronavirus calculator](https://github.com/deptofdefense/covid19-calculator). The graphs convey the following:\\n\\n#### Cohort Symptom and Condition prevalence\\nA line graph conveying the average coronavirus risk score of the cohort over the specified time period. For an individual report, a risk score over 40 would be considered 'high' and a risk score over 70 would be considered 'very high'.\\n\\n#### Cohort Coronavirus Risk\\nA multi-line graph providing counts of observations by coronavirus risk category, as defined by DDS's coronavirus risk calculator, over the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "9bf611c0-6251-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health unit summary graphs text",
        "visState": "{\"title\":\"Force health unit summary graphs text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The following three graphs below and to the right provide risk metrics on a per unit basis:\\n\\n#### At-risk Individuals by Unit\\nThe total number of observations that are 'at-risk' from a given unit over a given time period. An 'at-risk' observation is one that is classified as 'high' or 'very high' risk by the [DDS coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Total Symptoms reported by Unit\\nThe total number of observations containing symptoms coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\\n\\n#### Total Conditions reported by Unit\\nThe total number of observations containing conditions coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e2e816d0-29e6-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Individuals Per Risk Category",
        "visState": "{\"title\":\"Individuals Per Risk Category\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"mode\":\"normal\",\"show\":\"true\",\"showCircles\":true,\"type\":\"line\",\"valueAxis\":\"ValueAxis-1\"}],\"times\":[],\"type\":\"line\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f4b06bd0-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total symptoms reported by Unit",
        "visState": "{\"title\":\"Total symptoms reported by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Total symptoms reported\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Total symptoms reported\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total symptoms reported\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c39b0090-229c-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Conditions tracking",
        "visState": "{\"title\":\"Conditions tracking\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a0eeda70-229d-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom reports by Unit Heatmap",
        "visState": "{\"title\":\"Symptom reports by Unit Heatmap\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 65\":\"rgb(247,252,245)\",\"65 - 130\":\"rgb(199,233,192)\",\"130 - 195\":\"rgb(116,196,118)\",\"195 - 260\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "8e685260-2a94-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Average Risk Score",
        "visState": "{\"title\":\"Average Risk Score\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Risk Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Risk Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\",\"customLabel\":\"Average Risk Score\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "12409630-29ee-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Individuals by Category",
        "visState": "{\"title\":\"Individuals by Category\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "d3be0d70-eec4-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Symptom prevalence by Lodging",
        "visState": "{\"title\":\"Symptom prevalence by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"row\":true}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "4fef2150-e93d-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort coronavirus risk",
        "visState": "{\"title\":\"Cohort coronavirus risk\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "783c2c90-eecc-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Symptom and Condition Prevalence by Lodging",
        "visState": "{\"title\":\"Cohort Symptom and Condition Prevalence by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5c298f90-eecf-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Talk to someone Observation Share",
        "visState": "{\"title\":\"Talk to someone Observation Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.TalkToSomeone\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "ebe2c2e0-eecb-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Conditions prevalence by Lodging",
        "visState": "{\"title\":\"Conditions prevalence by Lodging\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"mode\":\"normal\",\"show\":\"true\",\"showCircles\":true,\"type\":\"line\",\"valueAxis\":\"ValueAxis-1\"}],\"times\":[],\"type\":\"line\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"row\":true}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "354112d0-e93f-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Symptom and Condition Prevalence",
        "visState": "{\"title\":\"Cohort Symptom and Condition Prevalence\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7afa6720-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Conditions by Lodging",
        "visState": "{\"title\":\"Conditions by Lodging\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Conditions\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Lodging\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 12\":\"rgb(247,252,245)\",\"12 - 23\":\"rgb(199,233,192)\",\"23 - 34\":\"rgb(116,196,118)\",\"34 - 45\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e201d150-229a-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Observations",
        "visState": "{\"title\":\"Total Observations\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c95255a0-e93b-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Anxiety / Concern",
        "visState": "{\"title\":\"Cohort Anxiety / Concern\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Sum of Details.TalkToSomeone\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Sum of Details.TalkToSomeone\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.TalkToSomeone\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "9d2f98b0-eecd-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Observations by Time",
        "visState": "{\"title\":\"Observations by Time\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1885c850-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Condition reports by Unit Heatmap",
        "visState": "{\"title\":\"Condition reports by Unit Heatmap\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 50\":\"rgb(247,252,245)\",\"50 - 100\":\"rgb(199,233,192)\",\"100 - 150\":\"rgb(116,196,118)\",\"150 - 200\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "40f18f20-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Units",
        "visState": "{\"title\":\"Total Units\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"_index\",\"customLabel\":\"Total Units\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b976ad90-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom tracking",
        "visState": "{\"title\":\"Symptom tracking\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Number reporting given symptom\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Number reporting given symptom\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Number reporting given symptom\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "dd03d8d0-e94a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Total Observations",
        "visState": "{\"title\":\"Total Observations\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total Observations\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c8f9d790-e94a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Total Individuals",
        "visState": "{\"title\":\"Total Individuals\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"EDIPI.keyword\",\"customLabel\":\"Persons\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a7194d00-2850-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bf289fd0-61a9-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Unit Symptom Health",
        "visState": "{\"title\":\"Unit Symptom Health\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Observations with symptoms or conditions\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"filter\":{\"bool\":{\"should\":[{\"exists\":{\"field\":\"Details.Symptoms.keyword\"}},{\"exists\":{\"field\":\"Details.Conditions.keyword\"}}]}}}},\"meta\":{\"negate\":false,\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"disabled\":false,\"alias\":\"Conditions OR Symptoms Exist\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"filter\\\":{\\\"bool\\\":{\\\"should\\\":[{\\\"exists\\\":{\\\"field\\\":\\\"Details.Symptoms.keyword\\\"}},{\\\"exists\\\":{\\\"field\\\":\\\"Details.Conditions.keyword\\\"}}]}}}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "01bd38c0-229d-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Conditions reported by Unit",
        "visState": "{\"title\":\"Total Conditions reported by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Total conditions reported\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Total conditions reported\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total conditions reported\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bbabdb50-eecd-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Soldier Observation follow-up",
        "visState": "{\"title\":\"Soldier Observation follow-up\",\"type\":\"table\",\"params\":{\"perPage\":20,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":2,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"Timestamp\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Date Time of Last Observation\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"top_hits\",\"schema\":\"metric\",\"params\":{\"field\":\"time_since_obs_hours\",\"aggregate\":\"concat\",\"size\":1,\"sortField\":\"Timestamp\",\"sortOrder\":\"desc\",\"customLabel\":\"Hours Since Last Observation\"},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Details.PhoneNumber.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Phone\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"_key\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":2,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a7194d00-2850-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "15be3790-618e-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Symptom Trending Line Graph",
        "visState": "{\"title\":\"Symptom Trending Line Graph\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "8c85ee40-544b-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Muster timing",
        "visState": "{\"title\":\"Muster timing\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Muster.status.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a7194d00-2850-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7fd3b4b0-51ea-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Servicemember Muster Non-Compliance Rate",
        "visState": "{\"title\":\"Servicemember Muster Non-Compliance Rate\",\"type\":\"enhanced-table\",\"params\":{\"computedColsPerSplitCol\":false,\"computedColumns\":[{\"label\":\"Muster non-compliance rate\",\"formula\":\"col5 / col4\",\"format\":\"number\",\"pattern\":\"0,0%\",\"alignment\":\"left\",\"applyAlignmentOnTitle\":true,\"applyAlignmentOnTotal\":true,\"applyTemplate\":false,\"applyTemplateOnTotal\":true,\"template\":\"{{value}}\",\"enabled\":true}],\"filterAsYouType\":false,\"filterBarHideable\":false,\"filterBarWidth\":\"25%\",\"filterCaseSensitive\":false,\"filterHighlightResults\":false,\"filterTermsSeparately\":false,\"hideExportLinks\":false,\"perPage\":10,\"showFilterBar\":false,\"showMetricsAtAllLevels\":false,\"showPartialRows\":false,\"showTotal\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"totalFunc\":\"sum\",\"hiddenColumns\":\"4,5\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"EDIPI.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"EDIPI\"},\"hidden\":false},{\"id\":\"5\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.firstName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"First Name\"},\"hidden\":false},{\"id\":\"6\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.lastName.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Last Name\"},\"hidden\":false},{\"id\":\"7\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.phone.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"splitcols\",\"params\":{\"filters\":[{\"input\":{\"query\":\"*\"},\"label\":\"\"},{\"input\":{\"query\":\"Muster.reported: false\"}}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"a7194d00-2850-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f1a95bb0-eeb9-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Mental Health",
        "hits": 0,
        "description": "A dashboard for relevantly tracking the \"Talk to someone\" field from service member submissions.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":25,\"y\":0,\"w\":11,\"h\":17,\"i\":\"2\"},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":36,\"y\":0,\"w\":12,\"h\":17,\"i\":\"3\"},\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":16,\"y\":27,\"w\":32,\"h\":14,\"i\":\"4\"},\"id\":\"c95255a0-e93b-11ea-b481-91d592e28f0d\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":27,\"w\":16,\"h\":14,\"i\":\"7\"},\"id\":\"5c298f90-eecf-11ea-aec4-4103718388c0\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":12,\"y\":0,\"w\":13,\"h\":17,\"i\":\"8\"},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":12,\"h\":17,\"i\":\"9\"},\"id\":\"e25abde0-e94e-11ea-b481-91d592e28f0d\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":17,\"w\":48,\"h\":10,\"i\":\"12\"},\"version\":\"6.4.1\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"id\":\"89db5d70-618d-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-14d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "55ae0f90-61a9-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom symptom graph text",
        "visState": "{\"title\":\"Health / Symptom symptom graph text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following three graphs below and to the right convey the following:\\n\\n#### Symptom Share\\nThe percentage share of symptoms from all observations reporting symptoms in the given time period. Keep in mind that individual observations can have multiple symptoms.\\n#### Condition Share\\nThe percentage share of all conditions from all observations reporting conditions in the given time period. Keep in mind that individual observations can have multiple conditions.\\n#### Unit Symptom health\\nA table that shows the number of observations received on a per unit basis where the individual reported symptoms or conditions.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c539a380-6265-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Cohort At-risk Individual Count by Lodging",
        "visState": "{\"title\":\"Cohort At-risk Individual Count by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"meta\":{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"type\":\"phrases\",\"key\":\"Category.keyword\",\"value\":\"high, very high\",\"params\":[\"high\",\"very high\"],\"negate\":false,\"disabled\":false,\"alias\":null},\"query\":{\"bool\":{\"should\":[{\"match_phrase\":{\"Category.keyword\":\"high\"}},{\"match_phrase\":{\"Category.keyword\":\"very high\"}}],\"minimum_should_match\":1}},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "061fb350-eeba-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Health / Symptom Tracking",
        "hits": 0,
        "description": "A dashboard for tracking soldier symptoms and coronavirus exposure potential",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"h\":12,\"i\":\"1\",\"w\":34,\"x\":14,\"y\":63},\"id\":\"4fef2150-e93d-11ea-b481-91d592e28f0d\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":12,\"i\":\"2\",\"w\":34,\"x\":14,\"y\":51},\"id\":\"354112d0-e93f-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":8,\"i\":\"4\",\"w\":27,\"x\":21,\"y\":12},\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":12,\"i\":\"6\",\"w\":13,\"x\":35,\"y\":0},\"id\":\"c8f9d790-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":46,\"i\":\"8\",\"w\":24,\"x\":0,\"y\":107},\"id\":\"d3be0d70-eec4-11ea-aec4-4103718388c0\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":46,\"i\":\"9\",\"w\":24,\"x\":24,\"y\":107},\"id\":\"ebe2c2e0-eecb-11ea-aec4-4103718388c0\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"10\",\"w\":24,\"x\":0,\"y\":92},\"id\":\"783c2c90-eecc-11ea-aec4-4103718388c0\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"12\",\"w\":24,\"x\":24,\"y\":36},\"id\":\"308b9ce0-e946-11ea-b481-91d592e28f0d\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"13\",\"w\":24,\"x\":0,\"y\":36},\"id\":\"496c5380-e946-11ea-b481-91d592e28f0d\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":12,\"i\":\"14\",\"w\":14,\"x\":21,\"y\":0},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":20,\"i\":\"15\",\"w\":21,\"x\":0,\"y\":0},\"id\":\"1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":16,\"i\":\"16\",\"w\":24,\"x\":0,\"y\":20},\"id\":\"55ae0f90-61a9-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"16\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":16,\"i\":\"17\",\"w\":24,\"x\":24,\"y\":20},\"id\":\"bf289fd0-61a9-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"17\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":24,\"i\":\"18\",\"w\":14,\"x\":0,\"y\":51},\"id\":\"cb8f07b0-61b7-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"18\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":17,\"i\":\"20\",\"w\":48,\"x\":0,\"y\":75},\"id\":\"b79376a0-61bd-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"20\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":15,\"i\":\"21\",\"w\":24,\"x\":24,\"y\":92},\"id\":\"c539a380-6265-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"21\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-7d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    }
  ],
  nonPii: [
    {
      "_id": "74234ab0-229a-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-health",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.durationMinutes\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.endTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.id.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.reported\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTime\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.startTime.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.timezone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.timezone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Disposition\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Disposition.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Provider Notes\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Provider Notes.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.Testing Status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.Testing Status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.in_rom\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom_end\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom_start\",\"type\":\"conflict\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false,\"conflictDescriptions\":{\"date\":[\"testgroup1-airhawk-base-es6ddssymptomobs-health\",\"testgroup1-black_death-base-es6ddssymptomobs-health\",\"testgroup1-bloody_bucket-base-es6ddssymptomobs-health\",\"testgroup1-devils_in_baggy_pants-base-es6ddssymptomobs-health\",\"testgroup1-example_text-base-es6ddssymptomobs-health\",\"testgroup1-grey_ghost-base-es6ddssymptomobs-health\",\"testgroup1-phantom-base-es6ddssymptomobs-health\",\"testgroup1-steel_rain-base-es6ddssymptomobs-health\"],\"text\":[\"testgroup1-blue_ghost-base-es6ddssymptomobs-health\"]}},{\"name\":\"Roster.rom_start.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.undefined\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.undefined.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "0aa4c0d0-f44d-11ea-82b7-4bc5055cc562",
      "_type": "index-pattern",
      "_source": {
        "title": "*",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.advancedParty\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.aircrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.billetWorkcenter\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.billetWorkcenter.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdi\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdqar\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.contractNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.contractNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.covid19TestReturnDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dscacrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.edipi.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastReported\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pilot\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pui\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rateRank\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rateRank.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rom.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.romRelease\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.romRelease.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"config.buildNum\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"config.defaultIndex\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"config.defaultIndex.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"config.telemetry:optIn\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.hits\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.optionsJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.panelsJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.refreshInterval.display\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.refreshInterval.pause\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.refreshInterval.section\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.refreshInterval.value\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.timeFrom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.timeRestore\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.timeTo\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"dashboard.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.uiStateJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"dashboard.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.fieldFormatMap\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"index-pattern.fields\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"index-pattern.intervalName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.notExpandable\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.sourceFilters\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"index-pattern.timeFieldName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"index-pattern.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.columns\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"search.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.hits\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"search.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.sort\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"search.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"search.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"server.uuid\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.hits\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.timelion_chart_height\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_columns\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_interval\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_other_interval\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_rows\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"timelion-sheet.timelion_sheet\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"timelion-sheet.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"updated_at\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.accessCount\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.accessDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.createDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"url.url\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"url.url.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"visualization.description\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.kibanaSavedObjectMeta.searchSourceJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.savedSearchId\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"visualization.title\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.uiStateJSON\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"visualization.version\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"visualization.visState\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c9198a80-2514-11eb-aa43-cf97fefcff0e",
      "_type": "search",
      "_source": {
        "title": "Alert - User Needs Medical Attention - Base",
        "description": "",
        "hits": 0,
        "columns": [
          "Roster.unit",
          "Category",
          "Details.TemperatureFahrenheit",
          "Details.TalkToSomeone",
          "Score"
        ],
        "sort": [
          "Timestamp",
          "desc"
        ],
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"highlightAll\":true,\"version\":true,\"query\":{\"language\":\"kuery\",\"query\":\"(Category.keyword  :  \\\"very high\\\" ) or (Category.keyword  : \\\"high\\\" ) or (Category.keyword : \\\"medium\\\" ) or (Details.TemperatureFahrenheit >= 102) or (Details.TalkToSomeone :  1)\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "afcaefb0-253c-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Symptom Trending",
        "hits": 0,
        "description": "Trends of Symptoms and Individual Health Categories over time.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":31,\"y\":0,\"w\":17,\"h\":15,\"i\":\"2\"},\"id\":\"e292ffd0-2863-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"2\",\"title\":\"Filters\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":31,\"h\":15,\"i\":\"3\"},\"id\":\"179bb360-2865-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"3\",\"title\":\"Dashboard Description\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":30,\"w\":48,\"h\":17,\"i\":\"6\"},\"id\":\"12409630-29ee-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":15,\"w\":48,\"h\":15,\"i\":\"7\"},\"version\":\"6.4.1\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"id\":\"15be3790-618e-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-7d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f4558e30-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Coronavirus Health Text",
        "visState": "{\"title\":\"Coronavirus Health Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":24,\"openLinksInNewTab\":false,\"markdown\":\"Coronavirus Exposure / Symptoms\\n---\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cdac5f10-f8e0-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Muster List Text",
        "visState": "{\"title\":\"Muster List Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Muster List\\nList of individuals with the last time they submitted an observation.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Soldier Observation Follow-up\\nA table that displays when the last time an individual submitted a symptoms observation report. Each row in the table shows the EDIPI, the individual's phone number, name, lodging, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the three columns.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5902bef0-6250-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health risk symptom text",
        "visState": "{\"title\":\"Force health risk symptom text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The four graphs below convey the following:\\n\\n#### Average Risk Score\\nThe average risk score of the cohort for the given time period. For individual observations, a score of 40 or higher would be classified as 'high' risk, and a score of '70' or higher would be classified as 'very high' risk.\\n\\n#### Individuals per Risk Category\\nA line graph providing the number of observations belonging to each category of coronavirus exposure risk as determined according to [DDS's coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Symptom Tracking\\nThe numbers of given symptoms reported in a particular time period. Note that single observations can contain multiple symptoms.\\n\\n#### Condition Tracking\\nThe numbers of given conditions reported in a particular time period. Note that single observations can contain multiple conditions.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "9bf611c0-6251-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health unit summary graphs text",
        "visState": "{\"title\":\"Force health unit summary graphs text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The following three graphs below and to the right provide risk metrics on a per unit basis:\\n\\n#### At-risk Individuals by Unit\\nThe total number of observations that are 'at-risk' from a given unit over a given time period. An 'at-risk' observation is one that is classified as 'high' or 'very high' risk by the [DDS coronavirus calculator](https://github.com/deptofdefense/covid19-calculator).\\n\\n#### Total Symptoms reported by Unit\\nThe total number of observations containing symptoms coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\\n\\n#### Total Conditions reported by Unit\\nThe total number of observations containing conditions coming from a given unit. This should show whether some units are being harder hit than others by illnesses.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "cb8f07b0-61b7-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptoms risk explanation",
        "visState": "{\"title\":\"Health / Symptoms risk explanation\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"The two graphs on the right convey concepts related to individuals' risk of coronavirus exposure. Details of the  used to produce Documentation for the scores and categories used by these graphs can be found in the [DDS created coronavirus calculator](https://github.com/deptofdefense/covid19-calculator). The graphs convey the following:\\n\\n#### Cohort Symptom and Condition prevalence\\nA line graph conveying the average coronavirus risk score of the cohort over the specified time period. For an individual report, a risk score over 40 would be considered 'high' and a risk score over 70 would be considered 'very high'.\\n\\n#### Cohort Coronavirus Risk\\nA multi-line graph providing counts of observations by coronavirus risk category, as defined by DDS's coronavirus risk calculator, over the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "abab3d40-61a0-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Muster non-compliance graph text",
        "visState": "{\"title\":\"Muster non-compliance graph text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The graphs below provide the following information:\\n\\n#### Daily Muster Non-Compliance\\nA graph showing muster compliance on a daily basis for the given time period and filters. If a very long time period such as years is selected, the graph will aggregate over longer segments of time than a day.\\n\\n#### Muster Timing\\nA multi-line graph showing the general timing of muster reports by individuals.\\n- *Early* - The report was provided **before** the appointed muster time-window.\\n- *Late* - The report was provided **after** the appointed muster time-window.\\n- *On-time* - The report was provided **during** the appointed muster time-window.\\n- *Non-Reporting* - **No report was provided** any time within the vicinity of the muster time-window, defined as the halfway point between the close of one muster reporting time-window and the beginning of another.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "353451a0-f8e2-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Individuals That Would Like to Talk to Someone Text",
        "visState": "{\"title\":\"Individuals That Would Like to Talk to Someone Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Individuals That Would Like to Talk to Someone\\nList of individuals that indicated they \\\"would like to talk someone\\\" in their submission\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Talk To Someone Recency Board\\nA table that shows all individuals who want to talk to someone. Each row in the table shows the EDIPI, name, phone, lodging, unit, date and time of last observation, and the number of hours since the last observation.  You may sort by any of the columns.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "179bb360-2865-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom trending - Text - Base",
        "visState": "{\"title\":\"Symptom trending - Text - Base\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Symptom Trending\\nLine chart of symptoms trending over time.\\n\\nLine chart of the count of individuals in their respective categories over time.\\n\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 24 Hours\\\".\\n\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n\\n#### Individual Needs Medical Attention Line Chart\\nMulti-line graph where each line and color shows the number of symptoms observations received throughout the time window as specified by the time filter in 12-hour time intervals. Each line and color represents a specific symptom. You may filter out specific symptoms by clicking on the symptom name on the right side of the graph.\\n\\n#### Individuals by Category\\nThis is a multi-line graph depicting the number of observations across all units along with their corresponding \\\"category\\\" of coronavirus exposure risk based on the reported symptoms and conditions, in accordance with DDS's [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7b945470-f8e1-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Coronavirus At-risk Individuals Follow-Up Text",
        "visState": "{\"title\":\"Coronavirus At-risk Individuals Follow-Up Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Individual needs medical attention\\nList of individuals at high risk of exposure to coronavirus based on their symptom submission.\\n\\\"**At-risk**\\\" is defined as any individual whose combination of reported symptoms, conditions, and temperature results in a categorization of \\\"high\\\" or \\\"very_high\\\" risk of coronavirus exposure in accordance with DDS's [coronavirus risk-score model](https://github.com/deptofdefense/covid19-calculator).\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 24 Hours\\\".\\n#### Recent Individuals at Risk of COVID-19 Exposure\\nA filtered table that shows the reporting status of only individuals who are deemed at risk for COVID-19 exposure. Each row in the table shows the EDIPI, score, risk exposure by category, date and time of last observation, temperature and the number of hours since the last observation.  You may sort by any of the columns.\\nIf an individual submits symptoms multiple times within the time period, this table displays the most recent data.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "29154300-4533-11eb-ad41-4d6b4e8c461f",
      "_type": "visualization",
      "_source": {
        "title": "Controls - Unit Selector",
        "visState": "{\"title\":\"Controls - Unit Selector\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1608737092395\",\"indexPattern\":\"1fe23f40-2440-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "78114120-2855-11eb-8bde-57c4cf572790",
      "_type": "visualization",
      "_source": {
        "title": "Medical Health Aggregation Control Board",
        "visState": "{\"title\":\"Medical Health Aggregation Control Board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1605563290045\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"EDIPI.keyword\",\"parent\":\"\",\"label\":\"EDIPI\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":false,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605799680710\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.firstName.keyword\",\"parent\":\"\",\"label\":\"First\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605799712742\",\"indexPattern\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.lastName.keyword\",\"parent\":\"\",\"label\":\"Last\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e4dbae10-618c-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Mental health tables explanation text",
        "visState": "{\"title\":\"Mental health tables explanation text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The tables to the right convey the following information:\\n#### Talk to Someone recency board\\n\\nA list of individuals who have indicated that they would like to talk to someone. Sort this list by the \\\"Last Timestamp\\\" column to bring the most recent individuals to the top.\\n\\n#### Anxiety / Concern Monitoring\\n\\nA list of individuals along with the total number of times they have asked to talk to someone. A higher number here may indicate a servicemember is in need of mental health attention or increased monitoring\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a2f3d060-6252-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force health heatmaps text",
        "visState": "{\"title\":\"Force health heatmaps text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following four heat maps provide a breakdown of particular symptom and condition prevalence across units and lodgings. These visualizations can be useful for examining potential \\\"hot-spots\\\" of symptoms / conditions linked either to units or lodging over the course of a period of time. If the concept of lodging does not make sense for your situation, e.g. you operate on a ship, then you may safely ignore the heatmaps related to lodging:\\n\\n#### Symptom reports by Unit Heatmap\\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-symptom basis.\\n\\n\\n#### Condition reports by Unit Heatmap \\nThis heatmap provides a breakdown of the number of observations on a per-unit and per-condition basis.\\n\\n#### Symptom reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-symptom basis.\\n\\n#### Condition reports by Lodging\\nThis heatmap provides a breakdown of the number of observations on a per-lodging and per-condition basis.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1fc60b10-292a-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Med Health Agg Report MD",
        "visState": "{\"title\":\"Med Health Agg Report MD\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"# Individual Symptom Trending\\n\\nThis dashboard is meant to help with examine individual servicemember's historic symptoms and coronavirus exposure potential. **Warning: The graphs and tables will generally not be useful until a filter for an individual servicemember is added.**\\n\\n#### Time Filter\\n\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 14 days\\\".\\n\\n#### Control Board\\n\\nFilter by EDIPI. All sections below will use the time and EDIPI filters.\\n\\n#### Daily Symptoms\\n\\nA table with a row for each date showing the symptoms that the person had each day along with their max score.\\n\\n#### Max Score per Day\\n\\nA visual line graph of the maximum score per day for each person.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "89db5d70-618d-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Mental health graphs explanation",
        "visState": "{\"title\":\"Mental health graphs explanation\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The graphs below provide the following:\\n\\n\\n#### Cohort Anxiety / Concern\\n\\nThe total number of symptom observations indicating a need to talk to someone over time. This should serve as an indicator of overall mental health among a cohort of servicemembers.\\n\\n#### Talk to someone observation share\\n\\nThe total share of observations indicating a need to talk to someone versus those that made no indication. This gives an overall view of mental health of the cohort during the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b79376a0-61bd-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom lodging text",
        "visState": "{\"title\":\"Health / Symptom lodging text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following graphs below all provide information related to health and symptoms across lodging. **If such a variable does not make sense for your situation, e.g. you operate on a ship, then you can safely ignore these graphs**. They provide the following information:\\n\\n#### Cohort Symptom and Condition Prevalence by Lodging\\nProvides the average risk score of observations by lodging\\n\\n#### Cohort At-risk Individual Count by Lodging\\nProvides the number of at-risk observations per lodging.  An \\\"at-risk\\\" observation is one in which the risk category is \\\"high\\\" or \\\"very high\\\" as determined by the DDS coronavirus calculator.\\n\\n#### Symptom Prevalence by Lodging\\nA graph providing the number of observations containing given symptoms by lodging. Note that symptoms are provided as a list. A single observation may have multiple concurrent symptoms.\\n\\n#### Condition Prevalence by Lodging\\nA graph providing the number of observations containing given conditions by lodging. Note that conditions are provided as a list. A single observation may have multiple concurrent symptoms.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "55ae0f90-61a9-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom symptom graph text",
        "visState": "{\"title\":\"Health / Symptom symptom graph text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"The following three graphs below and to the right convey the following:\\n\\n#### Symptom Share\\nThe percentage share of symptoms from all observations reporting symptoms in the given time period. Keep in mind that individual observations can have multiple symptoms.\\n#### Condition Share\\nThe percentage share of all conditions from all observations reporting conditions in the given time period. Keep in mind that individual observations can have multiple conditions.\\n#### Unit Symptom health\\nA table that shows the number of observations received on a per unit basis where the individual reported symptoms or conditions.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "09c49db0-e94f-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Data Quality Issues Text",
        "visState": "{\"title\":\"Data Quality Issues Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":24,\"openLinksInNewTab\":false,\"markdown\":\"Data Quality / Issues\\n---\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e2e816d0-29e6-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Individuals Per Risk Category",
        "visState": "{\"title\":\"Individuals Per Risk Category\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"mode\":\"normal\",\"show\":\"true\",\"showCircles\":true,\"type\":\"line\",\"valueAxis\":\"ValueAxis-1\"}],\"times\":[],\"type\":\"line\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f4b06bd0-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total symptoms reported by Unit",
        "visState": "{\"title\":\"Total symptoms reported by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Total symptoms reported\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Total symptoms reported\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total symptoms reported\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c39b0090-229c-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Conditions tracking",
        "visState": "{\"title\":\"Conditions tracking\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bd1983b0-51f7-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Daily Muster Non-Compliance",
        "visState": "{\"title\":\"Daily Muster Non-Compliance\",\"type\":\"area\",\"params\":{\"type\":\"area\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"},\"valueAxis\":null},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"percentage\",\"defaultYExtents\":false},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Percentage\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"area\",\"mode\":\"stacked\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"drawLinesBetweenPoints\":true,\"showCircles\":true,\"interpolate\":\"linear\",\"valueAxis\":\"ValueAxis-1\"}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"group\",\"params\":{\"filters\":[{\"input\":{\"query\":\"Muster.reported: false\"},\"label\":\"Number NOT reporting\"},{\"input\":{\"query\":\"Muster.reported: true\"},\"label\":\"Number Reporting\"}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"colors\":{\"Number NOT reporting\":\"#E24D42\",\"Number Reporting\":\"#BADFF4\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "8e685260-2a94-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Average Risk Score",
        "visState": "{\"title\":\"Average Risk Score\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Risk Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Risk Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\",\"customLabel\":\"Average Risk Score\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a0eeda70-229d-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom reports by Unit Heatmap",
        "visState": "{\"title\":\"Symptom reports by Unit Heatmap\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Unit\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 65\":\"rgb(247,252,245)\",\"65 - 130\":\"rgb(199,233,192)\",\"130 - 195\":\"rgb(116,196,118)\",\"195 - 260\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "91ed9950-eecf-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Observations over time by Lodging",
        "visState": "{\"title\":\"Observations over time by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "800b9af0-2a95-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "At-risk individuals by Unit",
        "visState": "{\"title\":\"At-risk individuals by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"should\":[{\"terms\":{\"Category.keyword\":[\"very high\",\"high\"]}},{\"bool\":{\"must\":[{\"term\":{\"Category.keyword\":\"medium\"}},{\"range\":{\"Details.TemperatureFahrenheit\":{\"gte\":102}}}]}}]}},\"meta\":{\"negate\":false,\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"disabled\":false,\"alias\":\"v. high, high, or (medium and temp >= 102)\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"should\\\":[{\\\"terms\\\":{\\\"Category.keyword\\\":[\\\"very high\\\",\\\"high\\\"]}},{\\\"bool\\\":{\\\"must\\\":[{\\\"term\\\":{\\\"Category.keyword\\\":\\\"medium\\\"}},{\\\"range\\\":{\\\"Details.TemperatureFahrenheit\\\":{\\\"gte\\\":102}}}]}}]}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "0df55b40-51eb-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Unit Muster Non-Compliance rate",
        "visState": "{\"title\":\"Unit Muster Non-Compliance rate\",\"type\":\"enhanced-table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\",\"computedColumns\":[{\"label\":\"Muster non-compliance rate\",\"formula\":\"col2 / col1\",\"format\":\"number\",\"pattern\":\"0,0%\",\"alignment\":\"left\",\"applyAlignmentOnTitle\":true,\"applyAlignmentOnTotal\":true,\"applyTemplate\":false,\"applyTemplateOnTotal\":true,\"template\":\"{{value}}\",\"enabled\":true}],\"computedColsPerSplitCol\":false,\"hideExportLinks\":false,\"showFilterBar\":false,\"filterCaseSensitive\":false,\"filterBarHideable\":false,\"filterAsYouType\":false,\"filterTermsSeparately\":false,\"filterHighlightResults\":false,\"filterBarWidth\":\"25%\",\"hiddenColumns\":\"1,2\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"filters\",\"schema\":\"splitcols\",\"params\":{\"filters\":[{\"input\":{\"query\":\"*\"},\"label\":\"\"},{\"input\":{\"query\":\"Muster.reported: false\"}}]},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"kuery\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "ebe2c2e0-eecb-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Conditions prevalence by Lodging",
        "visState": "{\"title\":\"Conditions prevalence by Lodging\",\"type\":\"line\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"labels\":{\"show\":true,\"truncate\":100},\"position\":\"bottom\",\"scale\":{\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{},\"type\":\"category\"}],\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"legendPosition\":\"right\",\"seriesParams\":[{\"data\":{\"id\":\"1\",\"label\":\"Count\"},\"drawLinesBetweenPoints\":true,\"mode\":\"normal\",\"show\":\"true\",\"showCircles\":true,\"type\":\"line\",\"valueAxis\":\"ValueAxis-1\"}],\"times\":[],\"type\":\"line\",\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"labels\":{\"filter\":false,\"rotate\":0,\"show\":true,\"truncate\":100},\"name\":\"LeftAxis-1\",\"position\":\"left\",\"scale\":{\"mode\":\"normal\",\"type\":\"linear\"},\"show\":true,\"style\":{},\"title\":{\"text\":\"Count\"},\"type\":\"value\"}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"row\":true}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "d3be0d70-eec4-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Symptom prevalence by Lodging",
        "visState": "{\"title\":\"Symptom prevalence by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"d\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"row\":true}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "12409630-29ee-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Individuals by Category",
        "visState": "{\"title\":\"Individuals by Category\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "5c298f90-eecf-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Talk to someone Observation Share",
        "visState": "{\"title\":\"Talk to someone Observation Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.TalkToSomeone\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "783c2c90-eecc-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Symptom and Condition Prevalence by Lodging",
        "visState": "{\"title\":\"Cohort Symptom and Condition Prevalence by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":500,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "4fef2150-e93d-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort coronavirus risk",
        "visState": "{\"title\":\"Cohort coronavirus risk\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Category.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "bf289fd0-61a9-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Unit Symptom Health",
        "visState": "{\"title\":\"Unit Symptom Health\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMetricsAtAllLevels\":false,\"sort\":{\"columnIndex\":null,\"direction\":null},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Observations with symptoms or conditions\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":null,\"direction\":null}}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"query\":{\"bool\":{\"filter\":{\"bool\":{\"should\":[{\"exists\":{\"field\":\"Details.Symptoms.keyword\"}},{\"exists\":{\"field\":\"Details.Conditions.keyword\"}}]}}}},\"meta\":{\"negate\":false,\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"disabled\":false,\"alias\":\"Conditions OR Symptoms Exist\",\"type\":\"custom\",\"key\":\"query\",\"value\":\"{\\\"bool\\\":{\\\"filter\\\":{\\\"bool\\\":{\\\"should\\\":[{\\\"exists\\\":{\\\"field\\\":\\\"Details.Symptoms.keyword\\\"}},{\\\"exists\\\":{\\\"field\\\":\\\"Details.Conditions.keyword\\\"}}]}}}}\"},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "15be3790-618e-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Symptom Trending Line Graph",
        "visState": "{\"title\":\"Symptom Trending Line Graph\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "40f18f20-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Units",
        "visState": "{\"title\":\"Total Units\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"_index\",\"customLabel\":\"Total Units\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "01bd38c0-229d-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Conditions reported by Unit",
        "visState": "{\"title\":\"Total Conditions reported by Unit\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Total conditions reported\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Total conditions reported\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total conditions reported\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "9d2f98b0-eecd-11ea-aec4-4103718388c0",
      "_type": "visualization",
      "_source": {
        "title": "Observations by Time",
        "visState": "{\"title\":\"Observations by Time\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e201d150-229a-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Total Observations",
        "visState": "{\"title\":\"Total Observations\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1885c850-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Condition reports by Unit Heatmap",
        "visState": "{\"title\":\"Condition reports by Unit Heatmap\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Roster.unit.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 50\":\"rgb(247,252,245)\",\"50 - 100\":\"rgb(199,233,192)\",\"100 - 150\":\"rgb(116,196,118)\",\"150 - 200\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "7afa6720-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Conditions by Lodging",
        "visState": "{\"title\":\"Conditions by Lodging\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Conditions\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Lodging\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 12\":\"rgb(247,252,245)\",\"12 - 23\":\"rgb(199,233,192)\",\"23 - 34\":\"rgb(116,196,118)\",\"34 - 45\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b976ad90-229b-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom tracking",
        "visState": "{\"title\":\"Symptom tracking\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Number reporting given symptom\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Number reporting given symptom\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Number reporting given symptom\"},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{},\"customLabel\":\"\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "dd03d8d0-e94a-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Total Observations",
        "visState": "{\"title\":\"Total Observations\",\"type\":\"metric\",\"params\":{\"addTooltip\":true,\"addLegend\":false,\"type\":\"metric\",\"metric\":{\"percentageMode\":false,\"useRanges\":false,\"colorSchema\":\"Green to Red\",\"metricColorMode\":\"None\",\"colorsRange\":[{\"from\":0,\"to\":10000}],\"labels\":{\"show\":true},\"invertColors\":false,\"style\":{\"bgFill\":\"#000\",\"bgColor\":false,\"labelColor\":false,\"subText\":\"\",\"fontSize\":60}}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Total Observations\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "496c5380-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Symptom Share",
        "visState": "{\"title\":\"Symptom Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "57e71030-229e-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Symptom reports by Lodging",
        "visState": "{\"title\":\"Symptom reports by Lodging\",\"type\":\"heatmap\",\"params\":{\"type\":\"heatmap\",\"addTooltip\":true,\"addLegend\":true,\"enableHover\":false,\"legendPosition\":\"right\",\"times\":[],\"colorsNumber\":4,\"colorSchema\":\"Greens\",\"setColorRange\":false,\"colorsRange\":[],\"invertColors\":false,\"percentageMode\":false,\"valueAxes\":[{\"show\":false,\"id\":\"ValueAxis-1\",\"type\":\"value\",\"scale\":{\"type\":\"linear\",\"defaultYExtents\":false},\"labels\":{\"show\":false,\"rotate\":0,\"overwriteColor\":false,\"color\":\"#555\"}}]},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Symptoms.keyword\",\"size\":49997,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Symptoms\"},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"customLabel\":\"Lodging\"},\"hidden\":false}]}",
        "uiStateJSON": "{\"vis\":{\"defaultColors\":{\"0 - 12\":\"rgb(247,252,245)\",\"12 - 23\":\"rgb(199,233,192)\",\"23 - 34\":\"rgb(116,196,118)\",\"34 - 45\":\"rgb(35,139,69)\"}}}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "354112d0-e93f-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Symptom and Condition Prevalence",
        "visState": "{\"title\":\"Cohort Symptom and Condition Prevalence\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Average Score\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Average Score\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"Score\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c95255a0-e93b-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Cohort Anxiety / Concern",
        "visState": "{\"title\":\"Cohort Anxiety / Concern\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Sum of Details.TalkToSomeone\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Sum of Details.TalkToSomeone\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"Details.TalkToSomeone\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "308b9ce0-e946-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Condition Share",
        "visState": "{\"title\":\"Condition Share\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true,\"labels\":{\"show\":false,\"values\":true,\"last_level\":true,\"truncate\":100}},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"Details.Conditions.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c3644b10-229a-11eb-aa43-cf97fefcff0e",
      "_type": "dashboard",
      "_source": {
        "title": "Force Health",
        "hits": 0,
        "description": "Monitoring overall health of the force",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":38,\"y\":0,\"w\":10,\"h\":21,\"i\":\"2\"},\"id\":\"40f18f20-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":50,\"w\":24,\"h\":12,\"i\":\"3\"},\"id\":\"b976ad90-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":78,\"w\":24,\"h\":15,\"i\":\"4\"},\"id\":\"f4b06bd0-229b-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":0,\"w\":13,\"h\":21,\"i\":\"5\"},\"id\":\"6f708620-229c-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"5\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":50,\"w\":24,\"h\":12,\"i\":\"6\"},\"id\":\"c39b0090-229c-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"6\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":78,\"w\":24,\"h\":15,\"i\":\"7\"},\"id\":\"01bd38c0-229d-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":111,\"w\":24,\"h\":19,\"i\":\"8\"},\"id\":\"a0eeda70-229d-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":111,\"w\":24,\"h\":19,\"i\":\"9\"},\"id\":\"1885c850-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":130,\"w\":24,\"h\":15,\"i\":\"10\"},\"id\":\"57e71030-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":130,\"w\":24,\"h\":15,\"i\":\"11\"},\"id\":\"7afa6720-229e-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":37,\"w\":24,\"h\":13,\"i\":\"12\"},\"id\":\"e2e816d0-29e6-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":37,\"w\":24,\"h\":13,\"i\":\"13\"},\"id\":\"8e685260-2a94-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":62,\"w\":24,\"h\":16,\"i\":\"14\"},\"id\":\"800b9af0-2a95-11eb-aa43-cf97fefcff0e\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":14,\"h\":21,\"i\":\"15\"},\"id\":\"b5c163d0-61bf-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":21,\"w\":48,\"h\":16,\"i\":\"17\"},\"id\":\"5902bef0-6250-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"17\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":62,\"w\":24,\"h\":16,\"i\":\"18\"},\"id\":\"9bf611c0-6251-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"18\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":0,\"y\":93,\"w\":48,\"h\":18,\"i\":\"19\"},\"version\":\"6.4.1\",\"panelIndex\":\"19\",\"type\":\"visualization\",\"id\":\"a2f3d060-6252-11eb-ab11-f728fb6de5ec\",\"embeddableConfig\":{}},{\"gridData\":{\"x\":27,\"y\":0,\"w\":11,\"h\":21,\"i\":\"20\"},\"version\":\"6.4.1\",\"panelIndex\":\"20\",\"type\":\"visualization\",\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-14d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "2f5db6e0-eeba-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Muster Non-Compliance",
        "hits": 0,
        "description": "A Dashboard for examining muster non-compliance across a cohort",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":19,\"y\":0,\"w\":13,\"h\":11,\"i\":\"9\"},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":19,\"h\":24,\"i\":\"10\"},\"id\":\"82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":39,\"w\":24,\"h\":15,\"i\":\"11\"},\"id\":\"bd1983b0-51f7-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"11\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":32,\"y\":0,\"w\":16,\"h\":24,\"i\":\"13\"},\"id\":\"0df55b40-51eb-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":39,\"w\":24,\"h\":15,\"i\":\"14\"},\"id\":\"8c85ee40-544b-11eb-b1c2-819d629adfcd\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":24,\"w\":48,\"h\":15,\"i\":\"15\"},\"id\":\"abab3d40-61a0-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"gridData\":{\"x\":19,\"y\":11,\"w\":13,\"h\":13,\"i\":\"16\"},\"version\":\"6.4.1\",\"panelIndex\":\"16\",\"type\":\"visualization\",\"id\":\"e201d150-229a-11eb-aa43-cf97fefcff0e\",\"embeddableConfig\":{}}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-5y",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "f1a95bb0-eeb9-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Mental Health",
        "hits": 0,
        "description": "A dashboard for relevantly tracking the \"Talk to someone\" field from service member submissions.",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"h\":17,\"i\":\"3\",\"w\":12,\"x\":25,\"y\":0},\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"3\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":14,\"i\":\"4\",\"w\":32,\"x\":16,\"y\":27},\"id\":\"c95255a0-e93b-11ea-b481-91d592e28f0d\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":14,\"i\":\"7\",\"w\":16,\"x\":0,\"y\":27},\"id\":\"5c298f90-eecf-11ea-aec4-4103718388c0\",\"panelIndex\":\"7\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":17,\"i\":\"8\",\"w\":13,\"x\":12,\"y\":0},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":17,\"i\":\"9\",\"w\":12,\"x\":0,\"y\":0},\"id\":\"e25abde0-e94e-11ea-b481-91d592e28f0d\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"h\":10,\"i\":\"12\",\"w\":48,\"x\":0,\"y\":17},\"id\":\"89db5d70-618d-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-14d/d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "8c85ee40-544b-11eb-b1c2-819d629adfcd",
      "_type": "visualization",
      "_source": {
        "title": "Muster timing",
        "visState": "{\"title\":\"Muster timing\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Muster.status.keyword\",\"size\":5000,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "c539a380-6265-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Cohort At-risk Individual Count by Lodging",
        "visState": "{\"title\":\"Cohort At-risk Individual Count by Lodging\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{},\"hidden\":false},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"Timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}},\"hidden\":false},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"Details.Lodging.keyword\",\"size\":50,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"},\"hidden\":false}]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"index\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[{\"meta\":{\"index\":\"0767d120-2367-11eb-aa43-cf97fefcff0e\",\"type\":\"phrases\",\"key\":\"Category.keyword\",\"value\":\"high, very high\",\"params\":[\"high\",\"very high\"],\"negate\":false,\"disabled\":false,\"alias\":null},\"query\":{\"bool\":{\"should\":[{\"match_phrase\":{\"Category.keyword\":\"high\"}},{\"match_phrase\":{\"Category.keyword\":\"very high\"}}],\"minimum_should_match\":1}},\"$state\":{\"store\":\"appState\"}}]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "82b37000-f8dd-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Muster Compliance Text",
        "visState": "{\"title\":\"Muster Compliance Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Muster Non-Compliance\\nA dashboard supplying various ways of examining muster non-compliance across a cohort.\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of Observations in the cohort under examination.\\n#### Unit Muster Non-Compliance Rate\\nA table of units along with the percentage of times individuals in the unit did not report during muster for the given time period.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "6acea320-6268-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Total Individuals Estimate",
        "visState": "{\"title\":\"Total Individuals Estimate\",\"type\":\"metrics\",\"params\":{\"id\":\"61ca57f0-469d-11e7-af02-69e470af7417\",\"type\":\"metric\",\"series\":[{\"id\":\"61ca57f1-469d-11e7-af02-69e470af7417\",\"color\":\"#68BC00\",\"split_mode\":\"everything\",\"metrics\":[{\"id\":\"61ca57f2-469d-11e7-af02-69e470af7417\",\"type\":\"count\"}],\"separate_axis\":0,\"axis_position\":\"right\",\"formatter\":\"number\",\"chart_type\":\"line\",\"line_width\":1,\"point_size\":1,\"fill\":0.5,\"stacked\":\"none\",\"terms_field\":null}],\"time_field\":\"@timestamp\",\"index_pattern\":\"*health\",\"interval\":\"auto\",\"axis_position\":\"left\",\"axis_formatter\":\"number\",\"axis_scale\":\"normal\",\"show_legend\":1,\"show_grid\":1,\"background_color_rules\":[{\"id\":\"39bfbd00-6268-11eb-90af-9382121263d2\"}],\"bar_color_rules\":[{\"id\":\"5a224bd0-6268-11eb-90af-9382121263d2\"}]},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "b5c163d0-61bf-11eb-ab11-f728fb6de5ec",
      "_type": "visualization",
      "_source": {
        "title": "Force Health Dashboard Intro text",
        "visState": "{\"title\":\"Force Health Dashboard Intro text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"# Force Health Dashboard\\nThis dashboard provides a number of visualizations related to examining and exploring force health.\\n\\n#### Health Control Board\\nA set of controls for setting filters on unit, lodging, symptoms, or conditions. Choose apply changes to change the filters.\\n\\n#### Total Observations\\nThe total number of Observations in the cohort under examination.\\n\\n#### Total Units\\nThe total number of units represented by individuals making up the cohort under examination.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1",
      "_type": "visualization",
      "_source": {
        "title": "Health / Symptom Tracking Text",
        "visState": "{\"title\":\"Health / Symptom Tracking Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":true,\"markdown\":\"# Health / Symptom Tracking\\nA dashboard for tracking servicemember symptoms and coronavirus exposure potential\\n## Time Filter\\nTime filter for all data is adjusted at the top-right of the screen and is typically set to \\\"Last 15 minutes\\\".\\n#### Control Board\\nFilter by unit and/or lodging.  All sections below will use the time, unit, and lodging filters.\\n#### Total Observations\\nThe total number of symptoms observations.\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e25abde0-e94e-11ea-b481-91d592e28f0d",
      "_type": "visualization",
      "_source": {
        "title": "Mental Health Text",
        "visState": "{\"title\":\"Mental Health Text\",\"type\":\"markdown\",\"params\":{\"fontSize\":12,\"openLinksInNewTab\":false,\"markdown\":\"Mental Health\\n---\\n\\n#### Control Board\\n\\nControls for selecting unit and lodging filters to be applied to the other visualizations\\n\\n#### Total Observations\\n\\nThe total number of symptom observations given within the specified time range\"},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "061fb350-eeba-11ea-aa5e-43987d01131d",
      "_type": "dashboard",
      "_source": {
        "title": "Health / Symptom Tracking",
        "hits": 0,
        "description": "A dashboard for tracking soldier symptoms and coronavirus exposure potential",
        "panelsJSON": "[{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":63,\"w\":34,\"h\":12,\"i\":\"1\"},\"id\":\"4fef2150-e93d-11ea-b481-91d592e28f0d\",\"panelIndex\":\"1\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":14,\"y\":51,\"w\":34,\"h\":12,\"i\":\"2\"},\"id\":\"354112d0-e93f-11ea-b481-91d592e28f0d\",\"panelIndex\":\"2\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":21,\"y\":12,\"w\":27,\"h\":8,\"i\":\"4\"},\"id\":\"dd03d8d0-e94a-11ea-b481-91d592e28f0d\",\"panelIndex\":\"4\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":107,\"w\":24,\"h\":46,\"i\":\"8\"},\"id\":\"d3be0d70-eec4-11ea-aec4-4103718388c0\",\"panelIndex\":\"8\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":107,\"w\":24,\"h\":46,\"i\":\"9\"},\"id\":\"ebe2c2e0-eecb-11ea-aec4-4103718388c0\",\"panelIndex\":\"9\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":92,\"w\":24,\"h\":15,\"i\":\"10\"},\"id\":\"783c2c90-eecc-11ea-aec4-4103718388c0\",\"panelIndex\":\"10\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":36,\"w\":24,\"h\":15,\"i\":\"12\"},\"id\":\"308b9ce0-e946-11ea-b481-91d592e28f0d\",\"panelIndex\":\"12\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":36,\"w\":24,\"h\":15,\"i\":\"13\"},\"id\":\"496c5380-e946-11ea-b481-91d592e28f0d\",\"panelIndex\":\"13\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":21,\"y\":0,\"w\":27,\"h\":12,\"i\":\"14\"},\"id\":\"18aa2a20-f444-11ea-82b7-4bc5055cc562\",\"panelIndex\":\"14\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":0,\"w\":21,\"h\":20,\"i\":\"15\"},\"id\":\"1c7d7c10-f8e0-11ea-a7d8-ffb16ffdf4d1\",\"panelIndex\":\"15\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":20,\"w\":24,\"h\":16,\"i\":\"16\"},\"id\":\"55ae0f90-61a9-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"16\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":20,\"w\":24,\"h\":16,\"i\":\"17\"},\"id\":\"bf289fd0-61a9-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"17\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":51,\"w\":14,\"h\":24,\"i\":\"18\"},\"id\":\"cb8f07b0-61b7-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"18\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":0,\"y\":75,\"w\":48,\"h\":17,\"i\":\"20\"},\"id\":\"b79376a0-61bd-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"20\",\"type\":\"visualization\",\"version\":\"6.4.1\"},{\"embeddableConfig\":{},\"gridData\":{\"x\":24,\"y\":92,\"w\":24,\"h\":15,\"i\":\"21\"},\"id\":\"c539a380-6265-11eb-ab11-f728fb6de5ec\",\"panelIndex\":\"21\",\"type\":\"visualization\",\"version\":\"6.4.1\"}]",
        "optionsJSON": "{\"darkTheme\":false,\"hidePanelTitles\":false,\"useMargins\":true}",
        "version": 1,
        "timeRestore": true,
        "timeTo": "now",
        "timeFrom": "now-7d",
        "refreshInterval": {
          "pause": true,
          "value": 0
        },
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "e292ffd0-2863-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Alert - Control Board - Base",
        "visState": "{\"title\":\"Alert - Control Board - Base\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1599843098242\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1599843111344\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1605806664606\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Symptoms.keyword\",\"parent\":\"\",\"label\":\"Symptoms - Select all that apply (no selection implies all symptoms)\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"language\":\"lucene\",\"query\":\"\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "6f708620-229c-11eb-aa43-cf97fefcff0e",
      "_type": "visualization",
      "_source": {
        "title": "Health control board",
        "visState": "{\"title\":\"Health control board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1604933946497\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933991588\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933914012\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Symptoms.keyword\",\"parent\":\"\",\"label\":\"Symptoms\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1604933973627\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Conditions.keyword\",\"parent\":\"\",\"label\":\"Conditions\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "18aa2a20-f444-11ea-82b7-4bc5055cc562",
      "_type": "visualization",
      "_source": {
        "title": "Control Board",
        "visState": "{\"title\":\"Control Board\",\"type\":\"input_control_vis\",\"params\":{\"controls\":[{\"id\":\"1599843098242\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Roster.unit.keyword\",\"parent\":\"\",\"label\":\"Unit\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}},{\"id\":\"1599843111344\",\"indexPattern\":\"74234ab0-229a-11eb-aa43-cf97fefcff0e\",\"fieldName\":\"Details.Lodging.keyword\",\"parent\":\"\",\"label\":\"Lodging\",\"type\":\"list\",\"options\":{\"type\":\"terms\",\"multiselect\":true,\"dynamicOptions\":true,\"size\":5,\"order\":\"desc\"}}],\"updateFiltersOnChange\":false,\"useTimeFilter\":false,\"pinFilters\":false},\"aggs\":[]}",
        "uiStateJSON": "{}",
        "description": "",
        "version": 1,
        "kibanaSavedObjectMeta": {
          "searchSourceJSON": "{\"query\":{\"query\":\"\",\"language\":\"lucene\"},\"filter\":[]}"
        }
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "25e1a570-7c8d-11eb-a3c8-010813bb90b1",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-reports",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Affiliation\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Affiliation.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.durationMinutes\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.endTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.id.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.reported\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTime\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.startTime.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.timezone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.timezone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.div\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.div.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rate\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rate.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.traveler_or_contact\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.traveler_or_contact.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    }
  ],
  blank: [
    {
      "_id": "0aa4c0d0-f44d-11ea-82b7-4bc5055cc562",
      "_type": "index-pattern",
      "_source": {
        "title": "*",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Age\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Age.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Sp02Percent\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.firstName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "0767d120-2367-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-health",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    },
    {
      "_id": "a7194d00-2850-11eb-aa43-cf97fefcff0e",
      "_type": "index-pattern",
      "_source": {
        "title": "*-es6ddssymptomobs-reports",
        "timeFieldName": "Timestamp",
        "fields": "[{\"name\":\"API.Stage\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"API.Stage.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Browser.TimeZone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Browser.TimeZone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Category\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Category.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Application\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Application.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Environment\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Environment.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.GitCommit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.GitCommit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Client.Origin\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Client.Origin.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Conditions\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Conditions.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Confirmed\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Lodging\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Lodging.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.PhoneNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.PhoneNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Symptoms\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Symptoms.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TalkToSomeone\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.TemperatureFahrenheit\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Details.Unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Details.Unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"EDIPI\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"EDIPI.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"ID\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"ID.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Model.Version\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Model.Version.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.durationMinutes\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.endTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.id.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.reported\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTime\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.startTime.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.startTimestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.status\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.status.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Muster.timezone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Muster.timezone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.advancedParty\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.aircrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.billetWorkcenter\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.billetWorkcenter.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdi\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.cdqar\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.contractNumber\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.contractNumber.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.covid19TestReturnDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dept\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.dept.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.div\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.div.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.dscacrew\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.edipi\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.edipi.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.endDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.firstName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.firstName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastName\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.lastName.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.lastReported\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.phone\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.phone.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pilot\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.pui\",\"type\":\"boolean\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rate\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rate.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rateRank\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rateRank.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.rom\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.rom.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.romRelease\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.romRelease.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.startDate\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.traveler_or_contact\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.traveler_or_contact.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.undefined\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.undefined.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Roster.unit\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"Roster.unit.keyword\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"Timestamp\",\"type\":\"date\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":true},{\"name\":\"_id\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_index\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"_score\",\"type\":\"number\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_source\",\"type\":\"_source\",\"count\":0,\"scripted\":false,\"searchable\":false,\"aggregatable\":false,\"readFromDocValues\":false},{\"name\":\"_type\",\"type\":\"string\",\"count\":0,\"scripted\":false,\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false},{\"name\":\"time_since_obs_hours\",\"type\":\"number\",\"count\":0,\"scripted\":true,\"script\":\"(new Date().getTime() - doc['Timestamp'].value.getMillis()) / 1000 / 60 / 60\",\"lang\":\"painless\",\"searchable\":true,\"aggregatable\":true,\"readFromDocValues\":false}]",
        "fieldFormatMap": "{\"time_since_obs_hours\":{\"id\":\"number\"}}"
      },
      "_meta": {
        "savedObjectVersion": 2
      }
    }
  ],
};


