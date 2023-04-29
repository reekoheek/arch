import { program } from 'commander';
import path from 'path';
import { Initialize } from './runners/Initialize';
import { Manager } from './lib/archetype';
import { ClearCache } from './runners/ClearCache';
import { ArchError } from './ArchError';

const manager = new Manager();

process.on('uncaughtException', (err) => {
  if (err instanceof ArchError) {
    console.error('[arch]', err.message);
    process.exit(1);
  }

  console.error('[unknown err]', err);
  process.exit(1);
});

program.name('arch')
  .description('Archetype task runner')
  .version('1.0.0');

program.command('init')
  .description('Initialize project')
  .argument('<dest>', 'destination directory')
  .argument('[src]', 'source repository', 'reekoheek/empty-arch')
  .action((dest, src) => {
    return new Initialize(manager, path.resolve(dest)).run(src);
  });

program.command('clear-cache')
  .description('Initialize project')
  .action(() => {
    return new ClearCache(manager).run();
  });

program.parse();
