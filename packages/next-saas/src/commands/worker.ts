import { resolve, basename } from 'path';
import { readdirSync } from 'fs';
import * as log from 'next/dist/build/output/log';
import { cliCommand } from '../cli';
import { queue } from '../queue';

const jobsDir = resolve(process.cwd(), 'jobs');

export const saasWorker: cliCommand = () => {
  log.ready('started queue worker');

  const handlers = readdirSync(jobsDir).reduce((handlers, filename) => {
    const { default: handler } = require(resolve(jobsDir, filename));

    handlers[basename(filename, '.ts')] = handler;

    return handlers;
  }, {});

  queue.work(async (job) => {
    log.wait('processing...');

    try {
      await handlers[job.data.$name](job);

      log.event('processed successfully');
    } catch (err) {
      log.error('processing failed');
      throw err;
    }
  });
};
