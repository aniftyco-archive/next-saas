import { startedDevelopmentServer } from 'next/dist/build/output';
import * as Log from 'next/dist/build/output/log';
import arg from 'next/dist/compiled/arg/index.js';
import { getProjectDir } from 'next/dist/lib/get-project-dir';
import isError from 'next/dist/lib/is-error';
import { printAndExit } from 'next/dist/server/lib/utils';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { cliCommand } from '../cli';
import startServer from '../start-server';

export const saasDev: cliCommand = (argv) => {
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
        Starts the application in development mode (hot-code reloading, error
        reporting, etc)
      Usage
        $ next dev <dir> -p <port number>
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

  // Check if pages dir exists and warn if not
  if (!existsSync(dir)) {
    printAndExit(`> No such directory exists as the project root: ${dir}`);
  }

  async function preflight() {
    const { getPackageVersion } = await Promise.resolve(require('../lib/get-package-version'));
    const [sassVersion, nodeSassVersion] = await Promise.all([
      getPackageVersion({ cwd: dir, name: 'sass' }),
      getPackageVersion({ cwd: dir, name: 'node-sass' }),
    ]);
    if (sassVersion && nodeSassVersion) {
      Log.warn(
        'Your project has both `sass` and `node-sass` installed as dependencies, but should only use one or the other. ' +
          'Please remove the `node-sass` dependency from your project. ' +
          ' Read more: https://nextjs.org/docs/messages/duplicate-sass'
      );
    }
  }
  const allowRetry = !args['--port'];
  let port: number = args['--port'] || (process.env.PORT && parseInt(process.env.PORT)) || 3000;

  // we allow the server to use a random port while testing
  // instead of attempting to find a random port and then hope
  // it doesn't become occupied before we leverage it
  if (process.env.__NEXT_RAND_PORT) {
    port = 0;
  }

  // We do not set a default host value here to prevent breaking
  // some set-ups that rely on listening on other interfaces
  const host = args['--hostname'];

  startServer({ dir, dev: true, isNextDevCommand: true, allowRetry }, port, host)
    .then(async ({ app, actualPort, server }) => {
      const appUrl = `http://${!host || host === '0.0.0.0' ? 'localhost' : host}:${actualPort}`;
      startedDevelopmentServer(appUrl, `${host || '0.0.0.0'}:${actualPort}`);
      // Start preflight after server is listening and ignore errors:
      preflight().catch(() => {});
      // Finalize server bootup:
      await app.prepare();

      if (global.__$NEXT_SAAS__.config?.hooks?.['post-prepare']) {
        require(resolve(global.__$NEXT_SAAS__.PWD, global.__$NEXT_SAAS__.config.hooks['post-prepare'])).default({
          app,
          server,
        });
      }
    })
    .catch((err) => {
      if (err.code === 'EADDRINUSE') {
        let errorMessage = `Port ${port} is already in use.`;
        const pkgAppPath = require('next/dist/compiled/find-up').sync('package.json', {
          cwd: dir,
        });
        const appPackage = require(pkgAppPath);
        if (appPackage.scripts) {
          const nextScript = Object.entries(appPackage.scripts).find((scriptLine) => scriptLine[1] === 'next');
          if (nextScript) {
            errorMessage += `\nUse \`npm run ${nextScript[0]} -- -p <some other port>\`.`;
          }
        }
        console.error(errorMessage);
      } else {
        console.error(err);
      }
      process.nextTick(() => process.exit(1));
    });
};
