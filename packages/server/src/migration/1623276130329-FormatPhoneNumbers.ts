import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';
import { formatNumber } from 'libphonenumber-js';

export class FormatPhoneNumbers1623276130329 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await updatePhoneNumbers(queryRunner, phone => formatNumber(phone, 'US', 'NATIONAL'));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await updatePhoneNumbers(queryRunner, phone => {
      const phoneDigits = phone.replace(/\D/g, '');
      return (phoneDigits.length === 10)
        ? `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`
        : phone;
    });
  }

}

async function updatePhoneNumbers(queryRunner: QueryRunner, formatter: (phone: string) => string) {
  //
  // Orphaned records.
  //
  const orphanedRecords = await queryRunner.query(`SELECT "document_id", "phone" FROM "orphaned_record"`) as Array<{
    document_id: string;
    phone: string;
  }>;

  for (const row of orphanedRecords) {
    row.phone = formatter(row.phone);
    await queryRunner.query(`UPDATE "orphaned_record" SET "phone" = $1 WHERE "document_id" = $2`, [row.phone, row.document_id]);
  }

  //
  // Access requests.
  //
  const accessRequests = await queryRunner.query(`SELECT "id", "sponsor_phone" FROM "access_request"`) as Array<{
    id: number;
    sponsor_phone: string;
  }>;

  for (const row of accessRequests) {
    row.sponsor_phone = formatter(row.sponsor_phone);
    await queryRunner.query(`UPDATE "access_request" SET "sponsor_phone" = $1 WHERE "id" = $2`, [row.sponsor_phone, row.id]);
  }

  //
  // Users.
  //
  const users = await queryRunner.query(`SELECT "edipi", "phone" FROM "user"`) as Array<{
    edipi: string;
    phone: string;
  }>;

  for (const row of users) {
    row.phone = formatter(row.phone);
    await queryRunner.query(`UPDATE "user" SET "phone" = $1 WHERE "edipi" = $2`, [row.phone, row.edipi]);
  }

  //
  // Roster.
  //
  const rosterEntries = await queryRunner.query(`SELECT "id", "custom_columns" FROM "roster"`) as Array<{
    id: number;
    custom_columns: {
      [columnName: string]: string | boolean | number | null;
    };
  }>;

  // Disable triggers temporarily on roster to avoid roster history updates.
  await queryRunner.query(`ALTER TABLE "roster" DISABLE TRIGGER ALL`);

  for (const row of rosterEntries) {
    for (const [columnName, columnValue] of Object.entries(row.custom_columns)) {
      if (columnName.match(/phone/i) && typeof columnValue === 'string') {
        row.custom_columns[columnName] = formatter(columnValue);
      }
    }

    await queryRunner.query(`UPDATE "roster" SET "custom_columns" = $1 WHERE "id" = $2`, [row.custom_columns, row.id]);
  }

  // Re-enable triggers on roster.
  await queryRunner.query(`ALTER TABLE "roster" ENABLE TRIGGER ALL`);

  //
  // Roster history.
  //
  const rosterHistoryEntries = await queryRunner.query(`SELECT "id", "custom_columns" FROM "roster_history"`) as Array<{
    id: number;
    custom_columns: {
      [columnName: string]: string | boolean | number | null;
    };
  }>;

  for (const row of rosterHistoryEntries) {
    for (const [columnName, columnValue] of Object.entries(row.custom_columns)) {
      if (columnName.match(/phone/i) && typeof columnValue === 'string') {
        row.custom_columns[columnName] = formatter(columnValue);
      }
    }

    await queryRunner.query(`UPDATE "roster_history" SET "custom_columns" = $1 WHERE "id" = $2`, [row.custom_columns, row.id]);
  }
}
