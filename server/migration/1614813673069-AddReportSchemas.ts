import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportSchemas1614813673069 implements MigrationInterface {
  name = 'AddReportSchemas1614813673069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "report_schema" ("id" character varying NOT NULL, "name" character varying(256) NOT NULL, "columns" json NOT NULL DEFAULT '[]', "org_id" integer NOT NULL, CONSTRAINT "PK_c19c025244ceedaff94736f021f" PRIMARY KEY ("id", "org_id"))`);
    const orgs = await queryRunner.query(`SELECT id FROM "org"`);
    for (const org of orgs) {
      await queryRunner.query(
        `INSERT INTO "report_schema"("id", "name", "columns", "org_id") VALUES ($1, $2, $3, $4)`,
        [defaultReportSchema.id, defaultReportSchema.name, JSON.stringify(defaultReportSchema.columns), org.id],
      );
      const orgUnits = await queryRunner.query(`SELECT id, muster_configuration FROM unit WHERE org_id=${org.id}`) as { id: number, muster_configuration: MusterConfiguration[] }[];
      for (const unit of orgUnits) {
        if (unit.muster_configuration == null) {
          continue;
        }
        for (const musterConfiguration of unit.muster_configuration) {
          musterConfiguration.reportId = defaultReportSchema.id;
        }
        await queryRunner.query(
          `UPDATE "unit" SET muster_configuration=$1 WHERE id=${unit.id}`,
          [JSON.stringify(unit.muster_configuration)],
        );
      }
    }
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" SET DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "report_schema" ADD CONSTRAINT "FK_d1ffa8699456464f8d833838cba" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report_schema" DROP CONSTRAINT "FK_d1ffa8699456464f8d833838cba"`);
    await queryRunner.query(`ALTER TABLE "user_notification_setting" ALTER COLUMN "last_notified_date" DROP DEFAULT`);
    await queryRunner.query(`DROP TABLE "report_schema"`);
  }

}

export interface MusterConfiguration {
  days: number,
  startTime: string,
  timezone: string,
  durationMinutes: number,
  reportId?: string,
}


const defaultReportSchema = {
  id: 'es6ddssymptomobs',
  name: 'Symptom Observation Report',
  columns: [{
    keyPath: ['Details', 'Affiliation'],
    type: 'string',
    pii: false,
    phi: false,
    otherField: true,
  }, {
    keyPath: ['Details', 'City'],
    type: 'string',
    pii: true,
    phi: false,
    otherField: true,
  }, {
    keyPath: ['Details', 'ConditionState'],
    type: 'string',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'Conditions'],
    type: 'string',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'Confirmed'],
    type: 'long',
    pii: false,
    phi: false,
  }, {
    keyPath: ['Details', 'Exposures'],
    type: 'string',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'Installation'],
    type: 'string',
    pii: true,
    phi: false,
    otherField: true,
  }, {
    keyPath: ['Details', 'Location'],
    type: 'string',
    pii: true,
    phi: false,
    otherField: true,
  }, {
    keyPath: ['Details', 'Lodging'],
    type: 'string',
    pii: true,
    phi: false,
    otherField: true,
  }, {
    keyPath: ['Details', 'Medications'],
    type: 'string',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'PhoneNumber'],
    type: 'string',
    pii: true,
    phi: false,
  }, {
    keyPath: ['Details', 'ROM'],
    type: 'long',
    pii: false,
    phi: false,
  }, {
    keyPath: ['Details', 'ROMContact'],
    type: 'string',
    pii: true,
    phi: false,
  }, {
    keyPath: ['Details', 'ROMStartDate'],
    type: 'string',
    pii: false,
    phi: false,
  }, {
    keyPath: ['Details', 'ROMSupport'],
    type: 'long',
    pii: false,
    phi: false,
  }, {
    keyPath: ['Details', 'RoomNumber'],
    type: 'string',
    pii: true,
    phi: false,
  }, {
    keyPath: ['Details', 'Ship'],
    type: 'string',
    pii: true,
    phi: false,
    otherField: true,
  }, {
    keyPath: ['Details', 'SpO2Percent'],
    type: 'float',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'Symptoms'],
    type: 'string',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'TalkToSomeone'],
    type: 'long',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'TemperatureFahrenheit'],
    type: 'float',
    pii: true,
    phi: true,
  }, {
    keyPath: ['Details', 'TentOrBillet'],
    type: 'string',
    pii: true,
    phi: false,
  }, {
    keyPath: ['Details', 'Unit'],
    type: 'string',
    pii: true,
    phi: false,
    otherField: true,
  }],
};
