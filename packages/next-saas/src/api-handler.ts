import { IncomingMessage, ServerResponse } from 'http';
import nc from 'next-connect';
import { User } from '@prisma/client';
import { APIError } from './errors';
import { onError } from './middleware/onError';
import { onNoMatch } from './middleware/onNoMatch';
import middleware from './middleware';

export type NextHandler = (err?: Error | APIError) => void | Promise<void>;

export interface Request<Params = any, Body = any, Cookies = any> extends IncomingMessage {
  id: string;
  ipAddress: string;
  query: Params;
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

export interface Context<Params = any, Body = any, Cookies = any, Type = any> {
  req: Request<Params, Body, Cookies>;
  res: Response<Type>;
  request: Request<Params, Body, Cookies>;
  response: Response<Type>;
  user: User | null;
}

export type Middleware<Params = any, Body = any, Cookies = any, Type = any> = (
  context: Context<Params, Body, Cookies, Type>,
  next: NextHandler
) => any | Promise<any>;

export type Handler<Params = any, Body = any, Cookies = any, Type = any> = (
  cookiesontext: Context<Params, Body, Cookies, Type>
) => any | Promise<any>;

export type APIHandler = {
  (handler: Handler): void;
  use<Params = Record<string, string | any>, Body = Record<string, any>, Cookies = Record<string, string>, Type = any>(
    ...handlers: Middleware<Params, Body, Cookies, Type>[]
  ): APIHandler;
  get<Params = Record<string, string | any>, Body = Record<string, any>, Cookies = Record<string, string>, Type = any>(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
  head<Params = Record<string, string | any>, Body = Record<string, any>, Cookies = Record<string, string>, Type = any>(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
  options<
    Params = Record<string, string | any>,
    Body = Record<string, any>,
    Cookies = Record<string, string>,
    Type = any
  >(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
  post<Body = Record<string, any>, Params = Record<string, string | any>, Cookies = Record<string, string>, Type = any>(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
  put<Body = Record<string, any>, Params = Record<string, string | any>, Cookies = Record<string, string>, Type = any>(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
  patch<
    Body = Record<string, any>,
    Params = Record<string, string | any>,
    Cookies = Record<string, string>,
    Type = any
  >(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
  delete<
    Params = Record<string, string | any>,
    Body = Record<string, any>,
    Cookies = Record<string, string>,
    Type = any
  >(
    handler: Handler<Params, Body, Cookies, Type>
  ): APIHandler;
};

const mwHandle = (context: Context, use: any, ...middleware: Middleware[]) => {
  return use(
    '/',
    ...middleware.map((ware) => async (req: Request, res: Response, next: NextHandler) => {
      return ware(context, next);
    })
  );
};

const handle = (context: Context, action: any, handler: Handler) =>
  action(async (req: Request, res: Response) => {
    const response = await handler(context);

    return res.send(response);
  });

const setupContext = (context: Partial<Context>) => (req: Request, res: Response, next: NextHandler) => {
  req.ipAddress =
    ((req.headers['x-forwarded-for'] as string) || '').split(',').pop().trim() || req.socket.remoteAddress;
  context.req = req;
  context.res = res;

  return next();
};
const proxyHandler: ProxyHandler<(handler: Handler) => APIHandler> = {
  get: (_, method) => {
    const context: Partial<Context> = {
      user: null,
    };

    const instance = nc({ onNoMatch, onError }).use(setupContext(context));

    instance.get = handle.bind(null, context, instance.get);
    instance.head = handle.bind(null, context, instance.head);
    instance.options = handle.bind(null, context, instance.options);
    instance.post = handle.bind(null, context, instance.post);
    instance.put = handle.bind(null, context, instance.put);
    instance.patch = handle.bind(null, context, instance.patch);
    instance.delete = handle.bind(null, context, instance.delete);
    instance.use = mwHandle.bind(null, context, instance.use);

    return instance.use(...middleware)[method].bind(instance);
  },
};

export const handler = new Proxy((handler: Handler) => {
  const context: Partial<Context> = {
    user: null,
  };

  const instance = nc({ onNoMatch, onError }).use(setupContext(context));

  instance.use = mwHandle.bind(null, context, instance.use);

  return instance.use(...middleware).all(async (req: Request, res: Response) => {
    const response = await handler(context as Context);

    return res.send(response);
  }) as unknown;
}, proxyHandler) as APIHandler;

export default handler;
