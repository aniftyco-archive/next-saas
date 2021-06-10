import { Request, Response } from '../api-handler';
import { MethodNotAllowed } from '../errors';

export const onNoMatch = (req: Request, res: Response) => {
  return new MethodNotAllowed().render(req, res);
};
