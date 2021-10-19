import { setCors } from './middleware/setCors';
import { setRequestId } from './middleware/setRequestId';

const autoload = () => {
  const middlewares = global.__$NEXT_SAAS__?.autoload || [];

  return middlewares;
};

export default [setCors(), setRequestId(), ...autoload()];
