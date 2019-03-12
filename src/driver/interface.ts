export interface Bus {
  connect(): Promise<void>;
  publish(evt: string, payload: any): void;
  on(evt: string, cb: (payload: any) => Promise<void>): void;
}
