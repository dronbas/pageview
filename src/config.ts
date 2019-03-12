export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DEV = process.env.NODE_ENV !== 'production';

export const PORT = Number(process.env.PORT) || 3000;

export const PG_HOST = process.env.PG_HOST || '127.0.0.1';
export const PG_USERNAME = process.env.PG_USERNAME || 'pageview';
export const PG_PASSWORD = process.env.PG_PASSWORD || '123456';
export const PG_DATABASE = process.env.PG_DATABASE || 'pageview';
export const PG_PORT = Number(process.env.PG_PORT) || 5432;

export const NEW_PAGE_VIEW = 'new.page.view';

export const TEST_APP_KEY = 'some-test-key';
