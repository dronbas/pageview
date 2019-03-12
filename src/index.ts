import { createServer } from 'http';
import * as Koa from 'koa';
import { PORT } from './config';
import { createApp } from './createApp';
import { LocalBus } from './driver/localBus';
import { createPgDriver } from './driver/pg';
import { PageViewRepository } from './repository/pageView';
import { RemoteEvtCollect } from './service/remoteService';
import { makeLogger } from './utils/logger';
const logger = makeLogger('Main');
const transporter = new LocalBus();
const pgDriver = createPgDriver();

Promise.resolve()
  // .then(pgDriver.connect)
  // .then(() => logger.info(`PG connected`))
  .then(transporter.connect)
  .then(() => {
    logger.info(`Transporter connected`);
    const remoteService = new RemoteEvtCollect(transporter, new PageViewRepository(pgDriver));
    return remoteService.start();
  })
  .then(() => createApp(pgDriver, transporter))
  .then(
    (app: Koa) =>
      new Promise((resolve) => {
        logger.info(`App created`);
        const server = createServer(app.callback());
        server.listen(PORT, resolve);
      })
  )
  .then(() => {
    logger.info(`Http server is listening on ${PORT} - app started`);
  })
  .catch((err: Error) => {
    logger.error(err);
    process.exit(1);
  });

process.on('SIGINT', () => {
  logger.info(`Graceful shutdown`);
  process.exit(0);
});
