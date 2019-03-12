import { Context } from 'koa';
import { makeLogger } from '../utils/logger';

const logger = makeLogger('Gateway');
const ERRORS = {
  NOT_FOUND: 'not.found',
  INTERNAL_ERROR: 'internal.server.error',
};

export async function errorHandler(ctx: Context, next: any) {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.status = 404;
      ctx.body = { success: false, error: ERRORS.NOT_FOUND };
    }
  } catch (err) {
    logger.error(err);
    ctx.body = { success: false, error: ERRORS.INTERNAL_ERROR };
    ctx.status = 500;
  }
}
