import chalk from 'chalk';
import { cliCommand } from '../saas';

export const saasWorker: cliCommand = (argv) => {
  console.error(`${chalk.red('ERROR:')} This command is not implemented yet`);
  process.exit(1);
};
