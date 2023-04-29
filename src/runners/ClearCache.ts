import { Manager } from '../lib/archetype';

export class ClearCache {
  constructor(private manager: Manager) {}

  run() {
    return this.manager.clearCache();
  }
}
