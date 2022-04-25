/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as log from 'next/dist/build/output/log';
import arg from 'next/dist/compiled/arg/index.js';
import { sync as findUp } from 'next/dist/compiled/find-up';
import { NON_STANDARD_NODE_ENV } from 'next/dist/lib/constants';
import { printAndExit } from 'next/dist/server/lib/utils';
import { loadEnvConfig } from '@next/env';
import chalk from 'chalk';
import { resolve } from 'path';
import { PackageJson } from 'type-fest';
import { Middleware } from './api-handler';
import { displayHelpForNextCommand } from './utils';

declare global {
  namespace NodeJS {
    interface Global {
      __$NEXT_SAAS__: {
        PWD: string;
        pkg: PackageJson;
        autoload: Middleware[];
        config: {
          [key: string]: any;
          mailer?: {
            transport: 'SES' | 'SMTP';
            from?: string;
            templates?: string;
          };
        };
      };
    }
  }
}

global.__$NEXT_SAAS_CACHE__ = {
  events: {},
};
global.__$NEXT_SAAS__ = {};
global.__$NEXT_SAAS__.PWD = process.cwd();
global.__$NEXT_SAAS__.pkg = require(findUp('package.json', {
  cwd: global.__$NEXT_SAAS__.PWD,
}));
global.__$NEXT_SAAS__.config = global.__$NEXT_SAAS__.pkg['next-saas'] || {};
global.__$NEXT_SAAS__.autoload = (global.__$NEXT_SAAS__.pkg['next-saas']?.autoload || []).map((path: string) => {
  const { default: ware } = require(resolve(global.__$NEXT_SAAS__.PWD, path));

  return ware;
});

loadEnvConfig(global.__$NEXT_SAAS__.PWD);

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
const unsupportedCommand = (command: string) => () => {
  printAndExit(`${chalk.red('>')} ${command} is an unsupported command in next-saas.`);
};
const commands: { [command: string]: () => Promise<cliCommand> } = {
  build: () => import('next/dist/cli/next-build').then((i) => i.nextBuild),
  export: () => Promise.resolve(unsupportedCommand('export')),
  telemetry: () => import('next/dist/cli/next-telemetry').then((i) => i.nextTelemetry),
  lint: () => import('next/dist/cli/next-lint').then((i) => i.nextLint),
  start: () => import('./commands/start').then((i) => i.saasStart),
  dev: () => import('./commands/dev').then((i) => i.saasDev),
  db: () => import('./commands/db').then((i) => i.saasDb),
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
      ${Object.keys(commands)
        .filter((command) => ['export'].includes(command))
        .join(', ')}

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
  if (['db', 'worker'].includes(command)) {
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

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

commands[command]().then((exec) => exec(forwardedArgs));

if (command === 'dev') {
  const { CONFIG_FILE } = require('next/dist/shared/lib/constants');
  const { watchFile } = require('fs');
  watchFile(`${process.cwd()}/${CONFIG_FILE}`, (cur: any, prev: any) => {
    if (cur.size > 0 || prev.size > 0) {
      console.log(`\n> Found a change in ${CONFIG_FILE}. Restart the server to see the changes in effect.`);
    }
  });
}
