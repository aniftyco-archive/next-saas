import { Request, Response } from '../api-handler';
import { MethodNotAllowedError } from '../errors';

export const onNoMatch = (req: Request, res: Response) => {
  return new MethodNotAllowedError().render(req, res);
};
