import * as pino from 'pino';
import { DEV, NODE_ENV } from '../config';

export function makeLogger(name: string) {
  return pino({
    name,
    safe: true,
    prettyPrint: DEV,
    enabled: NODE_ENV !== 'test',
  });
}
