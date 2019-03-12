import * as client from 'knex';
import { resolve as pathResolve } from 'path';
import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USERNAME } from '../config';

const migrations = {
  tableName: 'migrations',
  directory: pathResolve(__dirname, '..', 'migrations'),
};

const pool = {
  min: 10,
  max: 40,
};
const connection = {
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  database: PG_DATABASE,
};

export const knexCfg = {
  pool,
  connection,
  migrations,
  client: 'pg',
};

export function createPgDriver() {
  const cli = client(knexCfg);

  return {
    client: cli,
    async connect() {
      await cli.raw('SELECT 1;');
      await cli.migrate.latest();
    },
  };
}
