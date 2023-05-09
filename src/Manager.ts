import { Adapter } from './Adapter';
import { Archetype } from './Archetype';
import { Github } from './adapters/Github';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { ArchetError } from './ArchetError';
import { ConsoleLogger, Logger } from './Logger';

export class Manager {
  private adapters: Adapter[] = [
    Github,
  ];

  constructor(readonly userDir = path.join(os.homedir(), '.archet'), readonly logger: Logger = new ConsoleLogger()) {}

  addAdapter(adapter: Adapter) {
    this.adapters.push(adapter);
    return this;
  }

  clearAdapters() {
    this.adapters = [];
    return this;
  }

  get(src: string): Archetype {
    for (const Adapter of this.adapters) {
      if (!Adapter.support(src)) {
        continue;
      }

      return new Adapter(src);
    }

    throw new ArchetError(`failed to resolve source: ${src}`);
  }

  async fetch(src: string, dest: string): Promise<void> {
    const arch = this.get(src);
    const cacheDir = path.join(this.userDir, 'cache', arch.kind, arch.uniqueId());
    const cacheExists = fs.existsSync(cacheDir);
    if (cacheExists) {
      this.logger.log('info', 'manager', 'cache exists, copy from cache');
    } else {
      this.logger.log('error', 'manager', `cache not exists, download from ${arch.kind}:${arch.uniqueId()}`);
      await arch.fetchTo(cacheDir);
    }
    fs.copySync(cacheDir, dest);
  }

  clearCache(): Promise<void> {
    fs.removeSync(path.join(this.userDir, 'cache'));
    return Promise.resolve();
  }
}
