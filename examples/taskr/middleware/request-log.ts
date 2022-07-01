import { log, Middleware } from 'next-saas';

declare module 'next-saas' {
  interface Registry {
    date?: Date;
  }
}
// Simple example middleware that just outputs
// the method and url being requested.
// For example `GET /api/healthz`
export default (): Middleware =>
  ({ req }, next) => {
    log.info(`${req.method} ${req.url}`);

    return next();
  };
