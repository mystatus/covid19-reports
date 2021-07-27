import database from './sqldb';
import { seedAll } from '../util/test-utils/seed';

export default (async function() {
  const connection = await database;
  await seedAll();
  await connection.close();
}());

