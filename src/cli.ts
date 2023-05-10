#!/usr/bin/env node

import path from 'path';
import { Initialize } from './runners/Initialize';
import { Manager } from './';
import { ClearCache } from './runners/ClearCache';
import { ArchetError } from './ArchetError';
import { Help } from './runners/Help';
import optimist from 'optimist';
import { ListArchetypes } from './runners/ListArchetypes';
import { AddCache } from './runners/AddCache';
import { RemoveCache } from './runners/RemoveCache';
import { UpdateCache } from './runners/UpdateCache';

process.on('uncaughtException', async(err) => {
  if (err instanceof ArchetError) {
    console.error('[archet]', err.message);
    console.info('');
    await new Help(manager).run();
    process.exit(1);
  }

  console.error('[unknown err]', err);
  process.exit(1);
});

const manager = new Manager();

(async() => {
  const argv = optimist.parse(process.argv.slice(2));
  switch (argv._[0]) {
  case 'init': {
    if (!argv._[1]) {
      throw new ArchetError('destination directory is mandatory');
    }
    await new Initialize(manager, path.resolve(argv._[1])).run(argv._[2]);
    break;
  }
  case 'ls':
    await new ListArchetypes(manager).run();
    break;
  case 'add':
    if (!argv._[1]) {
      throw new ArchetError('src is mandatory');
    }
    await new AddCache(manager).run(argv._[1]);
    break;
  case 'up':
    if (!argv._[1]) {
      throw new ArchetError('src is mandatory');
    }
    await new UpdateCache(manager).run(argv._[1]);
    break;
  case 'rm':
    if (!argv._[1]) {
      throw new ArchetError('src is mandatory');
    }
    await new RemoveCache(manager).run(argv._[1]);
    break;
  case 'clear':
    await new ClearCache(manager).run();
    break;
  default:
    await new Help(manager).run();
    break;
  }
})();
