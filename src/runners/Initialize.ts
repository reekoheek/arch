import fs from 'fs-extra';
import { Git } from '../lib/git';
import { Manager } from '../lib/archetype';
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
    console.info('');
    console.info('README');
    console.info(content.toString());
  }

  async run(src = EMPTY_SRC) {
    this.ensureDestination();

    await this.manager.fetch(src, this.dest);

    await new Git(this.dest).init();

    this.showReadme();
  }
}
