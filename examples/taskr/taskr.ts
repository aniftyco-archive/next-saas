import { event, log } from 'next-saas';

export default () => {
  event.on('get-users', async () => {
    log.event('get-users');
  });

  event.on('background-work-finished', async (result) => {
    log.event('background-work-finished', result);
  });

  event.on('background-work-started', async (result) => {
    log.event('background-work-started', result);
  });
};
