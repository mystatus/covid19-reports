import { MigrationInterface, QueryRunner } from 'typeorm';

export class ObservationMusterInfo1631655870629 implements MigrationInterface {

  name = 'ObservationMusterInfo1631655870629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "UQ_c3b96ba3699ceaa1c9c95bdab10"`);
    await queryRunner.query(`ALTER TABLE "observation" ALTER COLUMN "document_id" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "UQ_e42b29d9806e0ede479afe89932" UNIQUE ("document_id")`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "muster_window_id" text`);
    await queryRunner.query(`CREATE TYPE "observation_muster_status_enum" AS ENUM('early', 'on_time', 'late', 'non_reporting')`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "muster_status" "observation_muster_status_enum"`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "muster_configuration_id" integer`);
    await queryRunner.query(`ALTER TABLE "observation" ADD "roster_history_entry_id" integer`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_43ca62255f4cf78493d5d20cff5" FOREIGN KEY ("muster_configuration_id") REFERENCES "muster_configuration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "FK_cfd6c67f46d117504124b1f2337" FOREIGN KEY ("roster_history_entry_id") REFERENCES "roster_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    const orgs = await queryRunner.query(`SELECT id FROM "org"`);
    for (const org of orgs) {
      await queryRunner.query(
        `UPDATE "report_schema" SET "columns"=$1 WHERE "id"=$2 AND "org_id"=$3`,
        [JSON.stringify(newDefaultReportSchema.columns), newDefaultReportSchema.id, org.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_cfd6c67f46d117504124b1f2337"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "FK_43ca62255f4cf78493d5d20cff5"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "roster_history_entry_id"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "muster_configuration_id"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "muster_status"`);
    await queryRunner.query(`DROP TYPE "observation_muster_status_enum"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP COLUMN "muster_window_id"`);
    await queryRunner.query(`ALTER TABLE "observation" DROP CONSTRAINT "UQ_e42b29d9806e0ede479afe89932"`);
    await queryRunner.query(`ALTER TABLE "observation" ALTER COLUMN "document_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "observation" ADD CONSTRAINT "UQ_c3b96ba3699ceaa1c9c95bdab10" UNIQUE ("id", "document_id")`);

    const orgs = await queryRunner.query(`SELECT id FROM "org"`);
    for (const org of orgs) {
      await queryRunner.query(
        `UPDATE "report_schema" SET "columns"=$1 WHERE "id"=$2 AND "org_id"=$3`,
        [JSON.stringify(oldDefaultReportSchema.columns), oldDefaultReportSchema.id, org.id],
      );
    }
  }

}

enum ColumnType {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Boolean = 'boolean',
  Enum = 'enum',
}

const newDefaultReportSchema = {
  id: 'es6ddssymptomobs',
  columns: [{
    keyPath: ['Details', 'Affiliation'],
    name: 'Affiliation',
    displayName: 'Affiliation',
    type: ColumnType.String,
    pii: false,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'City'],
    name: 'City',
    displayName: 'City',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ConditionState'],
    name: 'ConditionState',
    displayName: 'Condition State',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Conditions'],
    name: 'Conditions',
    displayName: 'Conditions',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Confirmed'],
    name: 'Confirmed',
    displayName: 'Confirmed',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Exposures'],
    name: 'Exposures',
    displayName: 'Exposures',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Installation'],
    name: 'Installation',
    displayName: 'Installation',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Location'],
    name: 'Location',
    displayName: 'Location',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Lodging'],
    name: 'Lodging',
    displayName: 'Lodging',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Medications'],
    name: 'Medications',
    displayName: 'Medications',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'PhoneNumber'],
    name: 'PhoneNumber',
    displayName: 'Phone Number',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROM'],
    name: 'ROM',
    displayName: 'ROM',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROMContact'],
    name: 'ROMContact',
    displayName: 'ROM Contact',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROMStartDate'],
    name: 'ROMStartDate',
    displayName: 'ROM Start Date',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'ROMSupport'],
    name: 'ROMSupport',
    displayName: 'ROM Support',
    type: ColumnType.Number,
    pii: false,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'RoomNumber'],
    name: 'RoomNumber',
    displayName: 'Room Number',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Ship'],
    name: 'Ship',
    displayName: 'Ship',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'SpO2Percent'],
    name: 'Sp02Percent',
    displayName: 'Sp02 Percent',
    type: ColumnType.Number,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Symptoms'],
    name: 'Symptoms',
    displayName: 'Symptoms',
    type: ColumnType.String,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'TalkToSomeone'],
    name: 'TalkToSomeone',
    displayName: 'Talk To Someone',
    type: ColumnType.Number,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'TemperatureFahrenheit'],
    name: 'TemperatureFahrenheit',
    displayName: 'Temperature Fahrenheit',
    type: ColumnType.Number,
    pii: true,
    phi: true,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'TentOrBillet'],
    name: 'TentOrBillet',
    displayName: 'Tent Or Billet',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: false,
    custom: true,
    updatable: false,
  }, {
    keyPath: ['Details', 'Unit'],
    name: 'Unit',
    displayName: 'Unit',
    type: ColumnType.String,
    pii: true,
    phi: false,
    otherField: true,
    required: false,
    custom: true,
    updatable: false,
  }],
};

const oldDefaultReportSchema = {
  id: 'es6ddssymptomobs',
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
