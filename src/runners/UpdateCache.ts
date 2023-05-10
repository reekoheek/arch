import { Manager } from '../Manager';

export class UpdateCache {
  constructor(private manager: Manager) {}

  run(src: string) {
    return this.manager.fetchCache(src, true);
  }
}
