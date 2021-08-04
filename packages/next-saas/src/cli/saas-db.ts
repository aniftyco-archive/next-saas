import { printAndExit } from 'next/dist/server/lib/utils';
import { cliCommand } from '../saas';

export const saasDb: cliCommand = async (argv) => {
  const args = [];

  if (argv.length === 0 || argv.includes('--help')) {
    return printAndExit('help');
  }

  if (argv.includes('migrate')) {
    args.push('migrate', process.env.NODE_ENV === 'production' ? 'deploy' : 'dev');
  }

  if (argv.includes('generate')) {
    args.push('generate');
  }

  const prismaBin = require.resolve('prisma');
  const prisma = require('cross-spawn').spawn(prismaBin, args, {
    stdio: 'inherit',
    env: process.env,
  });

  const code = await require('p-event')(prisma, 'exit', { rejectionEvents: [] });

  process.exit(code);
};
