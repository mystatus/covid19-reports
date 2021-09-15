import { MigrationInterface, QueryRunner } from 'typeorm';

export class MusterConfig1631136076075 implements MigrationInterface {

  name = 'MusterConfig1631136076075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "muster_filter" ("id" SERIAL NOT NULL, "filter_params" json NOT NULL DEFAULT '{}', "muster_config_id" integer NOT NULL, "filter_id" integer NOT NULL, CONSTRAINT "PK_2303f34e95b96b7abec2ab647e2" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "muster_configuration" ("id" SERIAL NOT NULL, "days" integer, "start_time" character varying NOT NULL, "timezone" character varying NOT NULL, "duration_minutes" integer NOT NULL, "org_id" integer NOT NULL, "report_schema_id" character varying NOT NULL, "report_schema_org" integer NOT NULL, CONSTRAINT "PK_f22aa0f02055eff550b50dd9492" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "muster_filter" ADD CONSTRAINT "FK_1a9525063bd40794452746e1d7a" FOREIGN KEY ("muster_config_id") REFERENCES "muster_configuration"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "muster_filter" ADD CONSTRAINT "FK_cd9646f52ad60a73469a234986d" FOREIGN KEY ("filter_id") REFERENCES "saved_filter"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "muster_configuration" ADD CONSTRAINT "FK_7487fe8f47ff158f8fcece9a981" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "muster_configuration" ADD CONSTRAINT "FK_154fae37311b64ead02ff03b1c0" FOREIGN KEY ("report_schema_id", "report_schema_org") REFERENCES "report_schema"("id","org_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);

    const orgDefaultMusterConfigs = await queryRunner.query(`SELECT id, default_muster_configuration FROM "org"`) as OrgMuster[];
    for (const org of orgDefaultMusterConfigs) {
      const orgUnits = (await queryRunner.query(`SELECT id, name, include_default_config, muster_configuration FROM "unit" WHERE "org_id"=${org.id}`)) as UnitMuster[];
      const configs: MusterConfigWithFilters[] = [];
      for (const unit of orgUnits) {
        const musterConfigs = [...unit.muster_configuration, ...(unit.include_default_config ? org.default_muster_configuration : [])];
        if (musterConfigs.length > 0) {
          // create saved filter for unit
          const filter = {
            unit: { op: '=', value: unit.id, expression: '', expressionEnabled: false },
          };
          const filterId = (await queryRunner.query(
            `INSERT INTO saved_filter (name, entity_type, config, org_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (org_id, name, entity_type) DO UPDATE SET name = saved_filter.name
            RETURNING id`,
            [unit.name, 'roster', filter, org.id],
          ))[0].id;
          // add muster configuration that uses saved filter
          for (const musterConfig of musterConfigs) {
            let foundConfig = false;
            for (const config of configs) {
              if (configsEqual(musterConfig, config.muster)) {
                config.filters.push(filterId);
                foundConfig = true;
                break;
              }
            }
            if (!foundConfig) {
              configs.push({ muster: musterConfig, filters: [filterId] });
            }
          }
        }
      }
      for (const config of configs) {
        const musterConfigId = (await queryRunner.query(
          `INSERT INTO muster_configuration (days, start_time, timezone, duration_minutes, org_id, report_schema_id, report_schema_org)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [config.muster.days, config.muster.startTime, config.muster.timezone, config.muster.durationMinutes, org.id, config.muster.reportId, org.id],
        ))[0].id;
        for (const filter of config.filters) {
          await queryRunner.query(
            `INSERT INTO muster_filter (muster_config_id, filter_id)
            VALUES ($1, $2)`,
            [musterConfigId, filter],
          );
        }
      }
    }

    await queryRunner.query(`ALTER TABLE "org" DROP COLUMN "default_muster_configuration"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "muster_configuration"`);
    await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "include_default_config"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "muster_configuration" DROP CONSTRAINT "FK_154fae37311b64ead02ff03b1c0"`);
    await queryRunner.query(`ALTER TABLE "muster_configuration" DROP CONSTRAINT "FK_7487fe8f47ff158f8fcece9a981"`);
    await queryRunner.query(`ALTER TABLE "muster_filter" DROP CONSTRAINT "FK_cd9646f52ad60a73469a234986d"`);
    await queryRunner.query(`ALTER TABLE "muster_filter" DROP CONSTRAINT "FK_1a9525063bd40794452746e1d7a"`);
    await queryRunner.query(`ALTER TABLE "unit" ADD "include_default_config" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "unit" ADD "muster_configuration" json NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "org" ADD "default_muster_configuration" json NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`DROP TABLE "muster_configuration"`);
    await queryRunner.query(`DROP TABLE "muster_filter"`);
  }

}

function configsEqual(config1: MusterConfiguration, config2: MusterConfiguration) {
  return config1.reportId === config2.reportId
    && config1.days === config2.days
    && config1.durationMinutes === config2.durationMinutes
    && config1.startTime === config2.startTime
    && config1.timezone === config2.timezone;
}

type OrgMuster = {
  id: number;
  default_muster_configuration: MusterConfiguration[];
};

type UnitMuster = {
  id: number;
  name: string;
  include_default_config: boolean;
  muster_configuration: MusterConfiguration[];
};

type MusterConfigWithFilters = {
  muster: MusterConfiguration;
  filters: number[];
};

type MusterConfiguration = {
  startTime: string;
  timezone: string;
  durationMinutes: number;
  reportId: string;
  days?: number;
};
