import fs from 'fs-extra';
import { Git } from '../Git';
import { Manager } from '../Manager';
import { ArchetError } from '../ArchetError';
import path from 'path';

const EMPTY_SRC = 'reekoheek/empty-arch';

export class Initialize {
  constructor(private manager: Manager, private dest: string) {}

  ensureDestination() {
    if (!fs.existsSync(this.dest)) {
      fs.ensureDirSync(this.dest);
      return;
    }

    if (!fs.statSync(this.dest).isDirectory()) {
      throw new ArchetError('destination is not a directory');
    }

    if (fs.readdirSync(this.dest).length > 0) {
      throw new ArchetError('destination is not empty');
    }
  }

  showReadme() {
    const content = fs.readFileSync(path.join(this.dest, 'README.md'));
    this.manager.logger.log('info', 'readme');
    content.toString().split('\n').forEach((line) => {
      this.manager.logger.log('info', 'readme', line.trim());
    });
  }

  async run(src = EMPTY_SRC) {
    this.ensureDestination();

    await this.manager.fetch(src, this.dest);

    const git = new Git(this.dest, this.manager.logger);
    const initialized = await git.initialized();
    if (!initialized) {
      await git.init();
    }

    this.showReadme();
  }
}
