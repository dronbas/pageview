import * as compose from 'koa-compose';
import { Bus } from '../driver/interface';
import { PageViewRepository } from '../repository/pageView';
import { HealthController } from './health';
import { PageViewController } from './pageView';

export const api = (pgDriver: any, transporter: Bus) => {
  const controllers = [
    new HealthController(),
    new PageViewController(new PageViewRepository(pgDriver), transporter),
  ];

  return compose(
    controllers.reduce(
      (arr: any, controller: any) => [
        ...arr,
        controller.getRouter().routes(),
        controller.getRouter().allowedMethods(),
      ],
      []
    )
  );
};
