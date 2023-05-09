import cp from 'child_process';
import { ArchetError } from './ArchetError';
import { Logger } from './Logger';

export class Git {
  constructor(private cwd: string, private logger: Logger) {}

  initialized(): Promise<boolean> {
    return new Promise((resolve) => {
      const proc = cp.spawn('git', ['status'], {
        cwd: this.cwd,
      });
      proc.on('close', (code) => {
        const initialized = code === 0;
        resolve(initialized);
      });
    });
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = cp.spawn('git', ['init'], {
        cwd: this.cwd,
      });
      proc.stdout.on('data', (data) => {
        data.toString().trim().split('\n').forEach((line: string) => {
          this.logger.log('info', 'init git', line.trim());
        });
      });
      proc.stderr.on('data', (data) => {
        data.toString().trim().split('\n').forEach((line: string) => {
          this.logger.log('error', 'init git', line.trim());
        });
      });
      proc.on('close', (code) => {
        if (code !== 0) {
          return reject(new ArchetError('git init failed with code: ' + code));
        }
        resolve();
      });
    });
  }
}
