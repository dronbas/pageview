import { NEW_PAGE_VIEW } from '../config';
import { Bus } from '../driver/interface';
import { PageViewRepository as IPageViewRepository } from '../repository/interface';
import { makeLogger } from '../utils/logger';
import { NewPageViewEvt } from './interface';

const logger = makeLogger('RemoteEvtCollect');

export class RemoteEvtCollect {
  constructor(private transporter: Bus, private pageViewRepository: IPageViewRepository) {}

  start() {
    this.transporter.on(NEW_PAGE_VIEW, (payload: NewPageViewEvt) => this.onPageView(payload));
  }

  private async onPageView(payload: NewPageViewEvt) {
    try {
      await this.pageViewRepository.addEvt(payload.appKey, payload.url);
    } catch (err) {
      logger.error(err);
    }
  }
}
