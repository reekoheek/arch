import { Manager } from '../Manager';

export class AddCache {
  constructor(private manager: Manager) {}

  run(src: string) {
    return this.manager.fetchCache(src);
  }
}
