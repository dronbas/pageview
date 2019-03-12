import { EventEmitter } from 'events';
import { Bus } from './interface';

export class LocalBus implements Bus {
  private emitter = new EventEmitter();

  connect() {
    return Promise.resolve();
  }
  publish(evt: string, payload: any) {
    return this.emitter.emit(evt, payload);
  }

  on(evt: string, cb: (payload: any) => Promise<void>) {
    return this.emitter.on(evt, cb);
  }
}
