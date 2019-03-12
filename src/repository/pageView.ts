import * as Knex from 'knex';
import { PageViewRepository as IPageViewRepository } from './interface';

export class PageViewRepository implements IPageViewRepository {
  private driver: Knex;
  constructor(driver: any) {
    this.driver = driver.client;
  }
  async addEvt(appKey: string, url: string) {
    await this.driver.raw(
      `
        INSERT INTO page_views ("appId", "url")
        VALUES(
          (select id from apps where key = ?), ?)
        RETURNING "id";
      `,
      [appKey, url]
    );
  }
  async getUrlViewsCount(appKey: string, url: string) {
    const result = await this.driver('page_views')
      .count('id', 'count')
      .whereRaw(
        `
        "appId" = (select id from apps where key = ?)
        AND url = ?
        AND
        "createdAt" > TO_TIMESTAMP(?)
      `,
        [appKey, url, Math.floor(Date.now() / 1e3) - 60]
      )
      .first();

    return Number(result.count);
  }
}
