import chalk from 'chalk';

const help = {
  start: `
  Description
    Starts the application in production mode.

  Usage
    $ saas start <dir> -p <port>
  
  <dir> represents the directory of the Next.js application.
  If no directory is provided, the current directory will be used.
  
  Options
    --port, -p      A port number on which to start the application
    --hostname, -H  Hostname on which to start the application (default: 0.0.0.0)
    --help, -h      Displays this message
`,
  dev: `
  Description
    Starts the application in development mode (hot-code reloading, error
    reporting, etc)
  
  Usage
    $ saas dev <dir> -p <port number>
    
  <dir> represents the directory of the Next.js application.
  If no directory is provided, the current directory will be used.

  Options
    --port, -p      A port number on which to start the application
    --hostname, -H  Hostname on which to start the application (default: 0.0.0.0)
    --help, -h      Displays this message
`,
  telemetry: `
  Description
    Allows you to control Next.js' telemetry collection

  Usage
    $ saas telemetry [enable/disable]

  You may pass the 'enable' or 'disable' argument to turn Next.js' telemetry collection on or off.

  Learn more: ${chalk.cyan('https://nextjs.org/telemetry')}
`,
};

export const displayHelpForNextCommand = (command: string) => {
  console.log(help[command]);
  process.exit(0);
};
