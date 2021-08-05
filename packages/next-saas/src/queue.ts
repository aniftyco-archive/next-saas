import Queue, { JobOptions, ProcessCallbackFunction } from 'bull';

const queue = new Queue('next-saas', process.env.REDIS_URL);

export const dispatch = <Data = Record<string, any>>(name: string, data: Data, options?: JobOptions) => {
  return queue.add({ $name: name, ...data }, options);
};

export const work = (handler: ProcessCallbackFunction<any>) => {
  return queue.process(handler);
};
