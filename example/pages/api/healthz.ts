import handler from 'next-saas';
import requestId from '@app/middleware/request-id';

export default handler.use(requestId()).get((ctx) => {
  return { status: 'OK' };
});
