import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import nc, { NextHandler } from 'next-connect';
import { MaybePromise } from 'next-runtime';
import { ParsedUrlQuery } from 'next-runtime/types/querystring';
import * as log from 'next/dist/build/output/log';
import Context from './context';
import { APIError, InternalServerError, MethodNotAllowedError } from './errors';
import runtime, { Runtime } from './runtime';

export type { Request, Response } from './context';

export interface Registry {}

export type Primatives = string | number | boolean | Date;
export type HandlerResponse =
  | Primatives
  | Record<string, Primatives>
  | Primatives[]
  | Record<string, Primatives>[]
  | undefined;

export type Handler<Params extends {} = {}, Body extends {} = {}, Cookies extends {} = {}> = (
  context: Context<Params, Body, Cookies, keyof Registry> & Registry,
  next: NextHandler
) => MaybePromise<void> | MaybePromise<HandlerResponse>;

export type Middleware<Params extends {} = {}, Body extends {} = {}, Cookies extends {} = {}> = (
  context: Context<Params, Body, Cookies, keyof Registry> & Registry,
  next: NextHandler
) => MaybePromise<void>;

const onNoMatch = (req: NextApiRequest, res: NextApiResponse<HandlerResponse>) => {
  res.setHeader('Allow', (req as any).__allowed_methods.join(','));
  const err = new MethodNotAllowedError();

  res.status(err.statusCode);

  return res.send(err.toJSON());
};

const onError = (err: APIError | Error, req: NextApiRequest, res: NextApiResponse) => {
  if (!(err instanceof APIError)) {
    log.error(err);
    err = new InternalServerError();
  }

  res.status((err as APIError).statusCode);

  return res.send((err as APIError).toJSON());
};

const middlewareAction =
  <Params, Body, Cookies>(context: Context<Params, Body, Cookies, keyof Registry>, ware: Function) =>
  async (req: NextApiRequest, res: NextApiResponse<HandlerResponse>, next: NextHandler) => {
    return ware(context.attach({ req, res }), next);
  };

const handle = <Params, Body, Cookies>(
  context: Context<Params, Body, Cookies, keyof Registry> & Registry,
  action: Function,
  ...handlers: Handler<Params, Body, Cookies>[]
) => {
  const handler: Handler<Params, Body, Cookies> = handlers.pop();
  return action(
    ...handlers.map((ware) => middlewareAction(context, ware)),
    (req: NextApiRequest, res: NextApiResponse<HandlerResponse>, next: NextHandler) => {
      return Promise.resolve(handler(context.attach({ req, res }), next)).then((body) => {
        if (body) {
          return res.send(body);
        }

        return res.end();
      });
    }
  );
};

const middleware = <Params, Body, Cookies>(
  context: Context<Params, Body, Cookies, keyof Registry> & Registry,
  use: Function,
  ...wares: Middleware<Params, Body, Cookies>[]
) => {
  return use(
    '',
    wares.map((ware) => middlewareAction(context, ware))
  );
};

const proxyHandler: ProxyHandler<{}> = {
  get(_: any, method: string) {
    const instance: any = nc({ onNoMatch, onError });
    const context = new Context();

    instance.get = handle.bind(null, context, instance.get);
    instance.head = handle.bind(null, context, instance.head);
    instance.options = handle.bind(null, context, instance.options);
    instance.post = handle.bind(null, context, instance.post);
    instance.put = handle.bind(null, context, instance.put);
    instance.patch = handle.bind(null, context, instance.patch);
    instance.delete = handle.bind(null, context, instance.delete);
    instance.use((req: any, _: any, next: Function) => {
      req.__allowed_methods = (instance as { routes: { method: string }[] }).routes
        .map((route) => route.method)
        .filter((r) => r.length);

      return next();
    });
    instance.use = middleware.bind(null, context, instance.use);

    return instance[method].bind(instance);
  },
};

interface Params extends Record<string, any> {}
interface Body extends Record<string, any> {}
interface Cookies extends Record<string, any> {}

interface API {
  <
    Props extends Record<string, any>,
    Query extends ParsedUrlQuery = ParsedUrlQuery,
    Body extends Record<string, unknown> = Record<string, unknown>
  >(
    runtime: Runtime<Props, Query, Body>
  ): GetServerSideProps<Props, Query>;
  all<P = Params, B = Body, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  get<P = Params, B = Body, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  head<P = Params, B = Body, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  post<B = Body, P = Params, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  put<B = Body, P = Params, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  delete<P = Params, B = Body, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  options<P = Params, B = Body, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  trace<P = Params, B = Body, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  patch<B = Body, P = Params, C = Cookies>(...handlers: Handler<P, B, C>[]): this;
  use<P = Params, B = Body, C = Cookies>(...middleware: Middleware<P, B, C>[]): this;
}

export const handler = new Proxy(runtime, proxyHandler) as API;

export default handler;
