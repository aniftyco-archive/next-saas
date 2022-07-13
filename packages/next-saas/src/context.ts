import { NextApiRequest, NextApiResponse } from 'next';
import { get, has, set } from 'lodash';

export interface Request<Params = any, Body = any, Cookies = any> extends NextApiRequest {
  query: Params;
  cookies: Cookies;
  body: Body;
}

export interface Response extends NextApiResponse {}

export default class Context<Params, Body, Cookies, Registry> {
  public req?: Request<Params, Body, Cookies>;
  public res?: Response;

  set(path: Registry, value: any) {
    return set(this, path as any, value);
  }

  get(path: Registry, defaultValue?: string) {
    return get(this, path as any, defaultValue);
  }

  has(path: Registry) {
    return has(this, path as any);
  }

  attach(obj: Record<string, any>) {
    for (const [key, value] of Object.entries(obj)) {
      this.set(key as any, value);
    }

    return this;
  }
}
