import { resolve } from 'path';
import { setCors } from './middleware/setCors';
import { setRequestId } from './middleware/setRequestId';

export const autoload = () => {
  const middlewares = global.__$NEXT_SAAS__?.autoload.map((path) => {
    const { default: ware } = require(resolve(global.__$NEXT_SAAS__.PWD, path));

    return ware;
  });

  return middlewares;
};

export default [setCors(), setRequestId()];
