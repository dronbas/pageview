import { Context } from 'koa';
import { BaseController, Controller, Get } from './controller';

@Controller(`/`)
export class HealthController extends BaseController {
  @Get('/health')
  async checkHealth(ctx: Context) {
    ctx.body = 'OK';
  }
}
