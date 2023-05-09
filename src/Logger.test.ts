import { ConsoleLogger } from './Logger';
import assert from 'assert';

describe('ConsoleLogger', () => {
  describe('#log()', () => {
    it('log with console', () => {
      const origInfo = console.info;
      const origError = console.error;

      const hits: [string, string][] = [];
      console.info = (...args: string[]) => {
        hits.push(['info', args.join(' ')]);
      };

      console.error = (...args: string[]) => {
        hits.push(['error', args.join(' ')]);
      };

      try {
        const logger = new ConsoleLogger();
        logger.log('error', 'cat1', 'msg1');
        logger.log('info', 'cat2', 'msg2');
        assert.deepStrictEqual(hits, [['error', '[cat1] msg1'], ['info', '[cat2] msg2']]);
      } finally {
        console.info = origInfo;
        console.error = origError;
      }
    });
  });
});
