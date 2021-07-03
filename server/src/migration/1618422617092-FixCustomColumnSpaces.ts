import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';
import _ from 'lodash';

export class FixCustomColumnSpaces1618422617092 implements MigrationInterface {
  name = 'FixCustomColumnSpaces1618422617092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get a mapping of unit ids to org ids for looking up new names from roster data.
    const units = await queryRunner.query(`SELECT "id", "org_id" from "unit"`);
    const unitIdToOrgId: { [unitId: string]: string } = {};
    for (const unit of units) {
      unitIdToOrgId[unit.id] = unit.org_id;
    }

    // Convert custom roster column "name" values to the camelcase "display".
    const customRosterColumns = await queryRunner.query(`SELECT "name", "display", "org_id" FROM "custom_roster_column"`);
    const newNamesLookup: {
      [orgId: string]: {
        [oldName: string]: string
      }
    } = {};
    for (const customColumn of customRosterColumns) {
      const oldName = customColumn.name;

      // Rename 'Covid Test' columns to 'Covid Tested', as requested.
      let display = customColumn.display;
      if (display.toLowerCase() === 'covid test') {
        display = 'Covid Tested';
      }

      const newName = _.camelCase(display);
      await queryRunner.query(
        `UPDATE "custom_roster_column" SET "name"=$1, "display"=$2 WHERE "name"=$3`,
        [newName, display, oldName],
      );

      const orgId = customColumn.org_id;
      if (newNamesLookup[orgId] == null) {
        newNamesLookup[orgId] = {};
      }
      newNamesLookup[orgId][oldName] = newName;
    }

    // Save out the roster history so that we can restore it, since it will get modified
    // via trigger as the roster is updated.
    const rosterHistoryEntriesSaved = await queryRunner.query(`SELECT "id", "edipi", "first_name", "last_name", "custom_columns", "timestamp", "change_type", "unit_id" FROM "roster_history"`);

    // Update roster data with new custom column names.
    const rosterEntries = await queryRunner.query(`SELECT "id", "custom_columns", "unit_id" FROM "roster"`);
    for (const entry of rosterEntries) {
      const orgId = unitIdToOrgId[entry.unit_id];
      if (newNamesLookup[orgId] == null) {
        continue;
      }

      for (const oldName of Object.keys(entry.custom_columns)) {
        const newName = newNamesLookup[orgId][oldName];
        if (newName !== oldName) {
          entry.custom_columns[newName] = entry.custom_columns[oldName];
          delete entry.custom_columns[oldName];
        }
      }

      await queryRunner.query(
        `UPDATE "roster" SET "custom_columns"=$1 WHERE "id"=$2`,
        [JSON.stringify(entry.custom_columns), entry.id],
      );
    }

    // Restore roster history with new custom column names.
    await queryRunner.query(`DELETE FROM "roster_history"`);
    for (const entry of rosterHistoryEntriesSaved) {
      const orgId = unitIdToOrgId[entry.unit_id];
      if (newNamesLookup[orgId] == null) {
        continue;
      }

      for (const oldName of Object.keys(entry.custom_columns)) {
        const newName = newNamesLookup[orgId][oldName];
        if (newName !== oldName) {
          entry.custom_columns[newName] = entry.custom_columns[oldName];
          delete entry.custom_columns[oldName];
        }
      }

      await queryRunner.query(
        `INSERT INTO "roster_history" ("id", "edipi", "first_name", "last_name", "custom_columns", "timestamp", "change_type", "unit_id")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [entry.id, entry.edipi, entry.first_name, entry.last_name, JSON.stringify(entry.custom_columns), entry.timestamp.toISOString(), entry.change_type, entry.unit_id],
      );
    }
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
