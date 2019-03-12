import * as Knex from 'knex';
import * as moment from 'moment';
import { TEST_APP_KEY } from '../config';

async function createPartitions(
  knex: Knex,
  tableName: string,
  from = '20190311',
  to = '20190501',
  delta = 10
) {
  for (
    let currentStart: any = 'MINVALUE', currentEnd = moment(from, 'YYYYMMDD');
    currentEnd.isBefore(moment(to, 'YYYYMMDD'));
    currentStart = moment(currentEnd), currentEnd.add(delta, 'days')
  ) {
    const queryText = `CREATE TABLE ${tableName}${currentEnd.format(
      'YYYYMMDD'
    )} PARTITION OF ${tableName} FOR VALUES FROM (${
      currentStart === 'MINVALUE' ? 'MINVALUE' : `'${currentStart.format('YYYYMMDD')}'`
    }) TO ('${currentEnd.format('YYYYMMDD')}')`;

    await knex.raw(queryText);
  }
}

export async function up(knex: Knex) {
  await knex.raw(`
      CREATE TABLE apps
      (
        "id" SERIAL,
        "appName" TEXT,
        "key" TEXT,
        PRIMARY KEY ("id"),
        UNIQUE ("key")
      )
    `);
  await knex.table('apps').insert({ appName: 'test-app', key: TEST_APP_KEY });
  await knex.raw(`
    CREATE TABLE page_views
    (
      "id" SERIAL,
      "appId" INT NOT NULL,
      "url" TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT now(),
      PRIMARY KEY ("id", "createdAt"),
      FOREIGN KEY ("appId") REFERENCES apps ("id") ON DELETE CASCADE
    ) PARTITION BY RANGE("createdAt");
  `);

  await createPartitions(knex, 'page_views');
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('page_views');
  await knex.schema.dropTable('apps');
}
