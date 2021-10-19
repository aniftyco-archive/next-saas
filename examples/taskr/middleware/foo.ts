import { Context, NextHandler } from 'next-saas';

declare module 'next-saas' {
  interface Context {
    date?: Date;
  }
}

export default (ctx: Context, next: NextHandler) => {
  ctx.date = new Date();

  return next();
};
