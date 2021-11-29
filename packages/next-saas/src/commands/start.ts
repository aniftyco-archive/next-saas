import * as Log from 'next/dist/build/output/log';
import arg from 'next/dist/compiled/arg/index.js';
import { getProjectDir } from 'next/dist/lib/get-project-dir';
import isError from 'next/dist/lib/is-error';
import startServer from 'next/dist/server/lib/start-server';
import { printAndExit } from 'next/dist/server/lib/utils';
import { resolve } from 'path';
import { cliCommand } from '../cli';

export const saasStart: cliCommand = (argv) => {
  const validArgs: arg.Spec = {
    // Types
    '--help': Boolean,
    '--port': Number,
    '--hostname': String,

    // Aliases
    '-h': '--help',
    '-p': '--port',
    '-H': '--hostname',
  };
  let args: arg.Result<arg.Spec>;
  try {
    args = arg(validArgs, { argv });
  } catch (error) {
    if (isError(error) && error.code === 'ARG_UNKNOWN_OPTION') {
      return printAndExit(error.message, 1);
    }
    throw error;
  }
  if (args['--help']) {
    console.log(`
      Description
        Starts the application in production mode.
        The application should be compiled with \`next build\` first.
      Usage
        $ next start <dir> -p <port>
      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.
      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application (default: 0.0.0.0)
        --help, -h      Displays this message
    `);
    process.exit(0);
  }

  const dir = getProjectDir(args._[0]);
  let port: number = args['--port'] || (process.env.PORT && parseInt(process.env.PORT)) || 3000;
  const host = args['--hostname'] || '0.0.0.0';

  if (process.env.__NEXT_RAND_PORT) {
    port = 0;
  }

  startServer({ dir }, port, host)
    .then(async ({ app, actualPort }) => {
      const appUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${actualPort}`;
      Log.ready(`started server on ${host}:${actualPort}, url: ${appUrl}`);
      await app.prepare();
      if (global.__$NEXT_SAAS__.config?.hooks?.['post-prepare']) {
        const server = await (app as any).getServer();
        require(resolve(global.__$NEXT_SAAS__.PWD, global.__$NEXT_SAAS__.config.hooks['post-prepare'])).default({
          app,
          server,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
