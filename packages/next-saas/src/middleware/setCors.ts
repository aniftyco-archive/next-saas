import cors, { CorsOptions } from 'cors';
import { Middleware } from '../api-handler';
// import config from 'next.config';
const config = { cors: {} };

const options: CorsOptions = {
  origin: '*',
  methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Authorization', 'Accept', 'Content-Type'],
};

export const setCors =
  (): Middleware =>
  async ({ req, res }, next) => {
    return cors({ ...options, ...config.cors })(req, res, next);
  };
