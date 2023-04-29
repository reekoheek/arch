import fs from 'fs-extra';
import { Git } from '../lib/git';
import { Manager } from '../lib/archetype';
import { ArchError } from '../ArchError';

const EMPTY_SRC = 'reekoheek/empty-arch';

export class Initialize {
  constructor(private manager: Manager, private dest: string) {}

  ensureDestination() {
    if (!fs.existsSync(this.dest)) {
      fs.ensureDirSync(this.dest);
      return;
    }

    if (!fs.statSync(this.dest).isDirectory()) {
      throw new ArchError('destination is not a directory');
    }

    if (fs.readdirSync(this.dest).length > 0) {
      throw new ArchError('destination is not empty');
    }
  }

  async run(src = EMPTY_SRC) {
    this.ensureDestination();

    await this.manager.fetch(src, this.dest);

    await new Git(this.dest).init();
  }
}
