import { Middleware } from 'next-saas';
import { v4 as uuid } from 'uuid';

declare module 'next-saas' {
  interface Registry {
    reqId?: string;
  }
}

// Simple example middleware that just sets a request id
export default (header = 'X-Request-Id'): Middleware =>
  (ctx, next) => {
    ctx.set('reqId', (ctx.req.headers[header.toLowerCase()] as string) || uuid());

    ctx.res.setHeader(header, ctx.get('reqId'));

    return next();
  };
