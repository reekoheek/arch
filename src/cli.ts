#!/usr/bin/env node

import path from 'path';
import { Initialize } from './runners/Initialize';
import { Manager } from './';
import { ClearCache } from './runners/ClearCache';
import { ArchetError } from './ArchetError';

process.on('uncaughtException', (err) => {
  if (err instanceof ArchetError) {
    console.error('[archet]', err.message);
    console.info('');
    printHelp();
    process.exit(1);
  }

  console.error('[unknown err]', err);
  process.exit(1);
});

const manager = new Manager();

function printHelp() {
  console.info(`
Usage: archet [options] [command]

Archetype task runner

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  init <dest> [src]  Initialize project
  clear-cache        Initialize project
  help [command]     display help for command
    `.trim());
}

(async() => {
  const argv = process.argv.slice(2);
  switch (argv[0]) {
  case 'init': {
    if (!argv[1]) {
      throw new ArchetError('destination directory is mandatory');
    }

    const [dest, src] = argv.slice(1);
    await new Initialize(manager, path.resolve(dest)).run(src);

    break;
  }
  case 'clear-cache':
    await new ClearCache(manager).run();
    break;
  default:
    printHelp();
  }
})();
