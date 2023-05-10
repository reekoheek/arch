import { Manager } from '../Manager';

export class RemoveCache {
  constructor(private manager: Manager) {}

  run(src: string) {
    return this.manager.removeCache(src);
  }
}
