import { Git } from './Git';
import tmp from 'tmp';
import assert from 'assert';
import cp from 'child_process';
import { Logger } from './Logger';

describe('Git', () => {
  describe('#initialized()', () => {
    it('resolve true if initialized', async() => {
      const dir = tmp.dirSync({ unsafeCleanup: true });
      try {
        const git = new Git(dir.name, new MockLogger());
        cp.execSync('git init', {
          cwd: dir.name,
        });
        assert.strictEqual(await git.initialized(), true);
      } finally {
        dir.removeCallback();
      }
    });

    it('resolve false if not initialized', async() => {
      const dir = tmp.dirSync({ unsafeCleanup: true });
      try {
        const git = new Git(dir.name, new MockLogger());
        assert.strictEqual(await git.initialized(), false);
      } finally {
        dir.removeCallback();
      }
    });
  });

  describe('#init()', () => {
    it('resolve false if initialized', async() => {
      const dir = tmp.dirSync({ unsafeCleanup: true });
      try {
        const git = new Git(dir.name, new MockLogger());
        await git.init();
        assert.strictEqual(await git.initialized(), true);
      } finally {
        dir.removeCallback();
      }
    });
  });
});

class MockLogger implements Logger {
  logs: [string, string, string][] = [];
  log(severity: 'info' | 'error', category: string, message: string): void {
    this.logs.push([severity, category, message]);
  }
}
