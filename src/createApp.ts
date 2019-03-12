import * as Koa from 'koa';
import { api } from './controller';
import { Bus } from './driver/interface';
import { errorHandler } from './middleware/error-handler';

export function createApp(pgDriver: any, transporter: Bus): Koa {
  const app = new Koa();
  app.use(errorHandler);
  app.use(api(pgDriver, transporter));

  return app;
}
