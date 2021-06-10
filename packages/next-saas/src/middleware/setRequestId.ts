import { v4 as uuid } from 'uuid';
import { Middleware } from '../api-handler';

const headerName = 'X-Request-Id';

export const setRequestId: Middleware = async ({ req, res }, next) => {
  req.id = (req.headers[headerName.toLowerCase()] as string) || uuid();
  res.setHeader(headerName, req.id);

  return next();
};
