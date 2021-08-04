import * as log from 'next/dist/build/output/log';
import { cliCommand } from '../saas';

export const saasWorker: cliCommand = (argv) => {
  log.error('this command is not implemented yet');
  process.exit(1);
};
