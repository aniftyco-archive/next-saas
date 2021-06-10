/* eslint-disable @typescript-eslint/no-var-requires */
import * as log from 'next/dist/build/output/log';
import arg from 'next/dist/compiled/arg/index.js';
import { NON_STANDARD_NODE_ENV } from 'next/dist/lib/constants';
import { loadEnvConfig } from '@next/env';
import { displayHelpForNextCommand } from './utils';

loadEnvConfig(process.cwd());

['react', 'react-dom'].forEach((dependency) => {
  try {
    // When 'npm link' is used it checks the clone location. Not the project.
    require.resolve(dependency);
  } catch (err) {
    console.warn(
      `The module '${dependency}' was not found. Next.js requires that you include it in 'dependencies' of your 'package.json'. To add it, run 'npm install ${dependency}'`
    );
  }
});

const defaultCommand = 'dev';
export type cliCommand = (argv?: string[]) => void;
const commands: { [command: string]: () => Promise<cliCommand> } = {
  start: () => import('next/dist/cli/next-start').then((i) => i.nextStart),
  dev: () => import('next/dist/cli/next-dev').then((i) => i.nextDev),
  telemetry: () => import('next/dist/cli/next-telemetry').then((i) => i.nextTelemetry),
};

const args = arg(
  {
    // Types
    '--version': Boolean,
    '--help': Boolean,
    '--inspect': Boolean,

    // Aliases
    '-v': '--version',
    '-h': '--help',
  },
  {
    permissive: true,
  }
);

// Version is inlined into the file using taskr build pipeline
if (args['--version']) {
  console.log(`Next SaaS v${require('../package.json').version}`);
  console.log(`Next.js v${require('next/package.json').version}`);
  console.log(`Prisma v${require('prisma/package.json').version}`);
  process.exit(0);
}

// Check if we are running `next <subcommand>` or `next`
const foundCommand = Boolean(commands[args._[0]]);

// Makes sure the `next --help` case is covered
// This help message is only showed for `next --help`
// `next <subcommand> --help` falls through to be handled later
if (!foundCommand && args['--help']) {
  console.log(`
    Usage
      $ saas <command>

    Available commands
      ${Object.keys(commands).join(', ')}

    Options
      --version, -v   Version number
      --help, -h      Displays this message
    
    For more information run a command with the --help flag
      $ saas build --help
  `);
  process.exit(0);
}

const command = foundCommand ? args._[0] : defaultCommand;
const forwardedArgs = foundCommand ? args._.slice(1) : args._;

if (args['--inspect'])
  throw new Error(
    `--inspect flag is deprecated. Use env variable NODE_OPTIONS instead: NODE_OPTIONS='--inspect' saas ${command}`
  );

// Make sure the `saas <subcommand> --help` case is covered
if (args['--help']) {
  // only forward for our commands, use our internal help to write for next commands
  if (['worker'].includes(command)) {
    forwardedArgs.push('--help');
  } else {
    displayHelpForNextCommand(command);
  }
}

const defaultEnv = command === 'dev' ? 'development' : 'production';

const standardEnv = ['production', 'development', 'test'];

if (process.env.NODE_ENV && !standardEnv.includes(process.env.NODE_ENV)) {
  log.warn(NON_STANDARD_NODE_ENV);
}

(process.env as any).NODE_ENV = process.env.NODE_ENV || defaultEnv;

// this needs to come after we set the correct NODE_ENV or
// else it might cause SSR to break
const React = require('react');

if (typeof React.Suspense === 'undefined') {
  throw new Error(
    `The version of React you are using is lower than the minimum required version needed for Next.js. Please upgrade "react" and "react-dom": "npm install react react-dom" https://nextjs.org/docs/messages/invalid-react-version`
  );
}

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

commands[command]().then((exec) => exec(forwardedArgs));

if (command === 'dev') {
  const { CONFIG_FILE } = require('next/dist/next-server/lib/constants');
  const { watchFile } = require('fs');
  watchFile(`${process.cwd()}/${CONFIG_FILE}`, (cur: any, prev: any) => {
    if (cur.size > 0 || prev.size > 0) {
      console.log(`\n> Found a change in ${CONFIG_FILE}. Restart the server to see the changes in effect.`);
    }
  });
}
