import { IncomingMessage, ServerResponse } from 'http';
import nc from 'next-connect';
import { APIError } from './errors';
import { onError } from './middleware/onError';
import { onNoMatch } from './middleware/onNoMatch';
import middleware from './middleware';
// import { User } from '@prisma/client';

export type NextHandler = (err?: Error | APIError) => void | Promise<void>;

export interface Request<Query = any, Body = any, Cookies = any> extends IncomingMessage {
  id: string;
  query: Query;
  cookies: Cookies;
  body: Body;
}

export type Send<Type> = (body: Type) => void;

export interface Response<Type = any> extends ServerResponse {
  send: Send<Type>;
  json: Send<Type>;
  status: (statusCode: number) => Response<Type>;
  redirect(url: string): Response<Type>;
  redirect(status: number, url: string): Response<Type>;
}

export type Context<Q = any, B = any, C = any, T = any> = {
  req: Request<Q, B, C>;
  res: Response<T>;
  user: Record<string, any> | null;
};

export type Middleware<Q = any, B = any, C = any, T = any> = (
  context: Context<Q, B, C, T>,
  next: NextHandler
) => any | Promise<any>;

export type Handler<Q = any, B = any, C = any, T = any> = (context: Context<Q, B, C, T>) => any | Promise<any>;

export type APIHandler = {
  (handler: Handler): void;
  use<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    ...handlers: Middleware<Q, B, C, T>[]
  ): APIHandler;
  get<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
  head<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
  options<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
  post<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
  put<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
  patch<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
  delete<Q = Record<string, string | string[]>, B = any, C = Record<string, string>, T = any>(
    handler: Handler<Q, B, C, T>
  ): APIHandler;
};

const context: Partial<Context> = {
  user: null,
};

const mwHandle = (use: any, ...middleware: Middleware[]) => {
  return use(
    '/',
    ...middleware.map((ware) => async (req: Request, res: Response, next: NextHandler) => {
      return ware({ ...context, req, res } as Context, next);
    })
  );
};

const handle = (action: any, handler: Handler) =>
  action(async (req: Request, res: Response) => {
    return res.send(await handler({ ...context, req, res } as Context));
  });

const proxyHandler: ProxyHandler<(handler: Handler) => APIHandler> = {
  get: (_, method) => {
    const instance = nc({ onNoMatch, onError });

    instance.get = handle.bind(null, instance.get);
    instance.head = handle.bind(null, instance.head);
    instance.options = handle.bind(null, instance.options);
    instance.post = handle.bind(null, instance.post);
    instance.put = handle.bind(null, instance.put);
    instance.patch = handle.bind(null, instance.patch);
    instance.delete = handle.bind(null, instance.delete);
    instance.use = mwHandle.bind(null, instance.use);

    return instance.use(...middleware)[method].bind(instance);
  },
};

export const handler = new Proxy((handler: Handler) => {
  const instance = nc({ onNoMatch, onError });

  instance.use = mwHandle.bind(null, instance.use);

  return instance.use(...middleware).all(async (req: Request, res: Response) => {
    return res.send(await handler({ ...context, req, res } as Context));
  }) as unknown;
}, proxyHandler) as APIHandler;

export default handler;
