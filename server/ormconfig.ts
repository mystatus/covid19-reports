// This file fixes an issue where TypeORM will throw errors for an ormconfig exported without using module.exports.

import { ormConfig } from './src/ormconfig';

module.exports = { ...ormConfig };
