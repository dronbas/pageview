import { Context } from 'koa';
import { NEW_PAGE_VIEW, TEST_APP_KEY } from '../config';
import { Bus } from '../driver/interface';
import { PageViewRepository } from '../repository/interface';
import { NewPageViewEvt } from '../service/interface';
import { BaseController, Controller, Get } from './controller';

@Controller(`/`)
export class PageViewController extends BaseController {
  constructor(private pageViewRepository: PageViewRepository, private transporter: Bus) {
    super();
  }

  @Get('/')
  async getPageViews(ctx: Context) {
    const appKey = ctx.query.key || TEST_APP_KEY;
    const payload: NewPageViewEvt = {
      appKey,
      url: ctx.path,
    };

    this.transporter.publish(NEW_PAGE_VIEW, payload);
    const count = await this.pageViewRepository.getUrlViewsCount(appKey, ctx.path);

    ctx.body = this.makeResponse({ count });
  }
}
