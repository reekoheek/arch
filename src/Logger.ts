type Severity = 'info' | 'error';

export interface Logger {
  log(severity: Severity, category: string, message?: string): void;
}

export class ConsoleLogger implements Logger {
  log(severity: Severity, category: string, message?: string): void {
    // eslint-disable-next-line no-console
    console[severity](`[${category}]`, message ?? '');
  }
}
