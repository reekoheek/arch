import { Adapter } from './Adapter';
import { Archetype, ArchetypeInfo } from './Archetype';
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

  getCacheDir(arch: Archetype) {
    return path.join(this.userDir, 'cache', arch.kind, arch.id);
  }

  getInfos(): Record<string, ArchetypeInfo> {
    const cacheFile = path.join(this.userDir, 'cache', 'index.json');
    try {
      const result = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      Object.keys(result).forEach((key) => {
        const info = result[key];
        info.fetchedAt = new Date(info.fetchedAt);
      });
      return result;
    } catch (err) {
      return {};
    }
  }

  private saveInfos(infos: Record<string, ArchetypeInfo>) {
    const cacheFile = path.join(this.userDir, 'cache', 'index.json');
    const content = JSON.stringify(infos);
    fs.writeFileSync(cacheFile, content, 'utf-8');
  }

  private async _fetchCache(arch: Archetype, force = false): Promise<void> {
    const cacheDir = this.getCacheDir(arch);
    const cacheExists = fs.existsSync(cacheDir);
    if (cacheExists) {
      if (force) {
        fs.removeSync(cacheDir);
      } else {
        this.logger.log('info', 'manager', 'cache already exists');
        return;
      }
    }

    this.logger.log('error', 'manager', `fetch cache from ${arch.src}`);
    await arch.fetchTo(cacheDir);
  }

  async fetchCache(src: string, force = false): Promise<void> {
    const arch = this.get(src);
    await this._fetchCache(arch, force);
    const infos = this.getInfos();
    infos[arch.kind + ':' + arch.id] = {
      kind: arch.kind,
      id: arch.id,
      src: arch.src,
      fetchedAt: new Date(),
    };
    this.saveInfos(infos);
  }

  removeCache(src: string): Promise<void> {
    const arch = this.get(src);
    fs.removeSync(this.getCacheDir(arch));
    const infos = this.getInfos();
    delete infos[arch.kind + ':' + arch.id];
    this.saveInfos(infos);
    return Promise.resolve();
  }

  private _fetch(arch: Archetype, dest: string) {
    fs.copySync(this.getCacheDir(arch), dest);
    return Promise.resolve();
  }

  async fetch(src: string, dest: string): Promise<void> {
    const arch = this.get(src);
    await this._fetchCache(arch);
    await this._fetch(arch, dest);
  }

  clearCache(): Promise<void> {
    fs.removeSync(path.join(this.userDir, 'cache'));
    return Promise.resolve();
  }
}
