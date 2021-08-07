import Bull, { JobOptions, ProcessCallbackFunction } from 'bull';
import { pkg } from './utils';

export class Queue {
  private bull = new Bull(pkg.name, {
    redis: process.env.REDIS_URL,
    prefix: 'next-saas',
  });

  public async dispatch<Data = Record<string, any>>(name: string, data: Data, options?: JobOptions) {
    return this.bull.add({ $name: name, ...data }, options);
  }

  public async work(handler: ProcessCallbackFunction<any>) {
    return this.bull.process(handler);
  }
}

export const queue = new Queue();
