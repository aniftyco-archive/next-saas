import { printAndExit } from 'next/dist/server/lib/utils';
import chalk from 'chalk';

const help = {
  build: `
  Description
    Compiles the application for production deployment

  Usage
    $ saas build <dir>

  <dir> represents the directory of the Next.js application.
  If no directory is provided, the current directory will be used.
  Options

  --profile     Can be used to enable React Production Profiling
  --no-lint     Disable linting
  `,
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
  lint: `
  Description
    Run ESLint on every file in specified directories. 
    If not configured, ESLint will be set up for the first time.

  Usage
    $ saas lint <baseDir> [options]

  <baseDir> represents the directory of the Next.js application.
  If no directory is provided, the current directory will be used.

  Options
    Basic configuration:
      -h, --help                      List this help
      -d, --dir Array                 Set directory, or directories, to run ESLint - default: 'pages', 'components', and 'lib'
      -c, --config path::String       Use this configuration file, overriding all other config options
      --ext [String]                  Specify JavaScript file extensions - default: .js, .jsx, .ts, .tsx
      --resolve-plugins-relative-to path::String  A folder where plugins should be resolved from, CWD by default

    Specifying rules:
      --rulesdir [path::String]      Use additional rules from this directory
    
    Fixing problems:
      --fix                          Automatically fix problems
      --fix-type Array               Specify the types of fixes to apply (problem, suggestion, layout)
    
    Ignoring files:
      --ignore-path path::String     Specify path of ignore file
      --no-ignore                    Disable use of ignore files and patterns
    
    Handling warnings:
      --quiet                        Report errors only - default: false
      --max-warnings Int             Number of warnings to trigger nonzero exit code - default: -1
    
    Output:
      -f, --format String            Use a specific output format - default: Next.js custom formatter
    
    Inline configuration comments:
      --no-inline-config             Prevent comments from changing config or rules
      --report-unused-disable-directives  Adds reported errors for unused eslint-disable directives ("error" | "warn" | "off")
    
    Caching:
      --cache                        Only check changed files - default: false
      --cache-location path::String  Path to the cache file or directory - default: .eslintcache
    
    Miscellaneous:
      --error-on-unmatched-pattern   Show errors when any file patterns are unmatched - default: false
`,
};

export const displayHelpForNextCommand = (command: string) => {
  printAndExit(help[command], 0);
};
