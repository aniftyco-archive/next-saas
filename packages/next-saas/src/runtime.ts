import { InferGetServerSidePropsType } from 'next';
import {
  handle as runtime,
  json,
  MaybePromise,
  notFound as runtimeNotFound,
  redirect as runtimeRedirect,
  RequestBody,
  RuntimeContext,
} from 'next-runtime';
import { ParsedUrlQuery } from 'next-runtime/types/querystring';
import { APIError, InternalServerError, NotFoundError } from './errors';

export type InferProps<T> = InferGetServerSidePropsType<T>;

export type Loader<Props extends {} = {}, Params extends {} = {}> = (
  context: RuntimeContext<Params>
) => MaybePromise<Props>;

export type Action<Props extends {} = {}, Body extends {} = {}, Params extends {} = {}> = (
  context: RuntimeContext<Params> & RequestBody<Body>
) => MaybePromise<Props>;

export type Runtime<Props, Query, Body> = {
  loader?: Loader<Props, Query>;
  action?: Action<Props, Body, Query>;
};

export type Handlers = {
  loader?: Function;
  action?: Function;
};

class RedirectResponse {
  constructor(public destination: string, public statusCode: number, public headers: Record<string, string | number>) {}
}

const handle = (handler: Function) => {
  return async (ctx: RuntimeContext<ParsedUrlQuery> & RequestBody<any>) => {
    ctx.req.body = ctx.req.body ?? {};

    try {
      const response = await handler(ctx);

      // gSSP errors on non-serialized objects.
      return json(JSON.parse(JSON.stringify(response)));
    } catch (err) {
      if (err instanceof RedirectResponse) {
        return runtimeRedirect(err.destination, { status: err.statusCode, headers: err.headers as any });
      }

      if (!(err instanceof APIError)) {
        err = new InternalServerError();
      }

      if (err instanceof NotFoundError) {
        return runtimeNotFound({ status: err.statusCode, headers: (err as any).headers });
      }

      return json(err.toJSON(), err.statusCode);
    }
  };
};

export const notFound = (headers: Record<string, string | number> = {}) => {
  const response = new NotFoundError();

  (response as any).headers = headers;

  throw response;
};

export const redirect = (
  destination: string,
  status?: number | { statusCode?: number; headers?: Record<string, string | number> }
) => {
  throw new RedirectResponse(
    destination,
    typeof status === 'number' ? status : typeof status === 'object' ? status.statusCode : 302,
    typeof status === 'object' ? status.headers : {}
  );
};

export default (handlers: Handlers) => {
  const runtimeHanders: Partial<Record<'get' | 'post', Function>> = {};

  if (handlers.loader) {
    runtimeHanders.get = handle(handlers.loader);
  }

  if (handlers.action) {
    runtimeHanders.post = handle(handlers.action);
  }

  // We have to do this because it 404's if `get` isn't defined, so default to empty props.
  if (handlers.action && !handlers.loader) {
    runtimeHanders.get = () => ({ props: {} });
  }

  return runtime(runtimeHanders as any);
};
