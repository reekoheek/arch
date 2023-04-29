import cp from 'child_process';
import { ArchetError } from '../../ArchetError';

export class Git {
  constructor(private cwd: string) {}

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = cp.spawn('git', ['init'], {
        cwd: this.cwd,
      });
      proc.stdout.on('data', (data) => console.info('[init git]', data.toString().trim()));
      proc.stderr.on('data', (data) => console.error('[init git]', data.toString().trim()));
      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new ArchetError('git init failed with code: ' + code));
        }
      });
    });
  }
}
