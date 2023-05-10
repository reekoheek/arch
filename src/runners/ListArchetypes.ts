import { Manager } from '../Manager';

export class ListArchetypes {
  constructor(private manager: Manager) {}

  run() {
    const infos = this.manager.getInfos();
    this.manager.logger.log('info', 'list', 'available cache:');
    Object.keys(infos).forEach(key => {
      const info = infos[key];
      this.manager.logger.log('info', 'list', `${info.src} ${formatDate(info.fetchedAt)}`);
    });
    return Promise.resolve();
  }
}

function formatDate(dt: Date): string {
  return dt.toISOString();
}
