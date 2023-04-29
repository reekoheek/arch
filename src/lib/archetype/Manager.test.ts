import { Manager } from './Manager';
import assert from 'assert';
import tmp from 'tmp';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { Adapter } from './Adapter';
import { Archetype } from './Archetype';

describe('Manager', () => {
  describe('constructor', () => {
    it('set user dir', () => {
      const defaultUserDir = path.join(os.homedir(), '.arch');
      assert.strictEqual(new Manager().userDir, defaultUserDir);
      assert.strictEqual(new Manager('/foo/bar').userDir, '/foo/bar');
    });
  });

  describe('#addAdapter()', () => {
    it('add adapter', () => {
      const manager = new Manager();
      const adapter = {} as Adapter;
      manager.addAdapter(adapter);
      assert.notStrictEqual(manager['adapters'].length, 0);
      assert.strictEqual(manager['adapters'][manager['adapters'].length - 1], adapter);
    });
  });

  describe('#clearAdapters()', () => {
    it('clear adapters', () => {
      const manager = new Manager();
      manager.clearAdapters();
      assert.strictEqual(manager['adapters'].length, 0);
    });
  });

  describe('#get()', () => {
    it('get from github', () => {
      const manager = new Manager();
      assert.strictEqual(manager.get('https://github.com/reekoheek/empty-arch').kind, 'github');
      assert.strictEqual(manager.get('foo/bar').kind, 'github');
    });

    it('get from other', () => {
      const manager = new Manager();
      manager.addAdapter(class Sagara {
        kind = 'sagara';

        static support() {
          return true;
        }
      } as unknown as Adapter);
      assert.strictEqual(manager.get('https://sagara.id/arch/foo/bar').kind, 'sagara');
    });

    it('throw error if adapter not found', () => {
      const manager = new Manager();
      assert.throws(() => manager.get('https://sagara.id/arch/foo/bar'), /failed to resolve source:/);
    });
  });

  describe('#fetch()', () => {
    it.skip('fetch from source to destination', async() => {
      const userDir = tmp.dirSync({ unsafeCleanup: true });
      const workDir = tmp.dirSync({ unsafeCleanup: true });
      try {
        const manager = new Manager(userDir.name);
        await manager.fetch('reekoheek/empty-arch', workDir.name);
        const files = fs.readdirSync(workDir.name);
        assert.strictEqual(files.includes('.editorconfig'), true);
      } finally {
        userDir.removeCallback();
        workDir.removeCallback();
      }
    }).timeout(10000);

    it('fetch from cache', async() => {
      const userDir = tmp.dirSync({ unsafeCleanup: true });
      const workDir = tmp.dirSync({ unsafeCleanup: true });

      const cacheDir = path.join(userDir.name, 'cache/github/reekoheek/empty-arch');
      fs.ensureDirSync(cacheDir);
      fs.writeFileSync(path.join(cacheDir, '.editorconfig'), 'root = true\n');

      try {
        const manager = new Manager(userDir.name);
        await manager.fetch('reekoheek/empty-arch', workDir.name);
        const files = fs.readdirSync(workDir.name);
        assert.strictEqual(files.includes('.editorconfig'), true);
      } finally {
        userDir.removeCallback();
        workDir.removeCallback();
      }
    }).timeout(10000);
  });
});
