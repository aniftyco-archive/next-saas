import * as log from 'next/dist/build/output/log';
import { Request, Response } from '../api-handler';
import { APIError, InternalServerError } from '../errors';

export const onError = (err: APIError | Error, req: Request, res: Response) => {
  if (err instanceof APIError) {
    return err.render(req, res);
  }

  log.error(err.message);

  return new InternalServerError().render(req, res);
};
