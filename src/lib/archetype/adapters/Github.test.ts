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

  describe('#uniqueId()', () => {
    it('return unique id', () => {
      assert.strictEqual(new Github('foo/bar').uniqueId(), 'foo/bar');
      assert.strictEqual(new Github('https://github.com/reekoheek/empty-arch').uniqueId(), 'reekoheek/empty-arch');
    });
  });

  describe.skip('#fetchTo()', () => {
    it('fetch to dir', async() => {
      const { name, removeCallback } = tmp.dirSync({ unsafeCleanup: true });
      try {
        const arch = new Github('https://github.com/reekoheek/empty-arch');
        await arch.fetchTo(name);
        const files = fs.readdirSync(name);

        assert.strictEqual(files.includes('.editorconfig'), true);
      } finally {
        removeCallback();
      }
    }).timeout(10000);
  });
});
