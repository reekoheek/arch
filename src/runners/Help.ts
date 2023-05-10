import { Manager } from '../Manager';
import fs from 'fs';
import path from 'path';

export class Help {
  constructor(private manager: Manager) {}

  run(): Promise<void> {
    const pjs = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));
    const content = `
Usage: ${pjs.name} [options] [command]

${pjs.name} v${pjs.version}
${pjs.description}

Options:
  -h, --help         display help for command

Commands:
  init <dest> [src]  initialize project
  ls                 list archetypes
  add <src>          add cache
  up <src>           update cache
  rm <src>           remove cache
  clear              clear all cache
    `.trim();

    content.split('\n').forEach((line) => {
      this.manager.logger.log('info', 'help', line.trim());
    });
    return Promise.resolve();
  }
}
