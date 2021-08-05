import { Job, log } from 'next-saas';

export const handler = async (job: Job) => {
  await new Promise((r) => setTimeout(r, 2000));

  log.info(`job#${job.id} completed in 2 seconds`);

  return job;
};
