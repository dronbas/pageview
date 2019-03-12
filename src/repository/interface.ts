export interface PageViewRepository {
  addEvt(appKey: string, url: string): Promise<void>;
  getUrlViewsCount(appKey: string, url: string): Promise<number>;
}
