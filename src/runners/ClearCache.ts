import { Manager } from '../Manager';

export class ClearCache {
  constructor(private manager: Manager) {}

  run() {
    return this.manager.clearCache();
  }
}
