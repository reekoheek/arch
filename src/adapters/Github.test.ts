import { Github } from './Github';
import assert from 'assert';
import tmp from 'tmp';
import fs from 'fs-extra';

describe('Github', () => {
  describe('.support()', () => {
    it('return false if not supported', () => {
      assert.strictEqual(Github.support('foo'), false);
    });
  });

  describe('#id', () => {
    it('return unique id', () => {
      assert.strictEqual(new Github('foo/bar').id, 'foo/bar');
      assert.strictEqual(new Github('https://github.com/reekoheek/empty-arch').id, 'reekoheek/empty-arch');
    });
  });

  describe('#fetchTo()', () => {
    it('fetch to dir', async() => {
      const dir = tmp.dirSync({ unsafeCleanup: true });
      try {
        const arch = new Github('https://github.com/reekoheek/empty-arch');
        await arch.fetchTo(dir.name);
        const files = fs.readdirSync(dir.name);

        assert.strictEqual(files.includes('.editorconfig'), true);
      } finally {
        dir.removeCallback();
      }
    }).timeout(10000);
  });
});
