import { BehaviorSubject, EMPTY, Observable } from 'rxjs';

import { Entry } from '../component/entry';
import { LogLevel } from '../component/log-level';
import { STRING_TABLE_TYPE } from '../util/string-table-type';

import { Destination } from './destination';


interface Options {
  readonly installTrigger: boolean;
}

export class WebConsoleDestination implements Destination {
  private enabled = false;
  constructor(
      private readonly options: Partial<Options> = {},
  ) {
    this.run();
  }

  log(entry: Entry): void {
    if (!this.enabled) {
      return;
    }

    const messageString = this.getMessageString(entry);
    switch (entry.level) {
      case LogLevel.DEBUG:
        // tslint:disable-next-line:no-console
        console.debug(messageString);
        break;
      case LogLevel.ERROR:
        console.error(...entry.value);
        break;
      case LogLevel.FAILURE:
        console.warn(...entry.value);
        break;
      case LogLevel.INFO:
        console.info(...entry.value);
        break;
      case LogLevel.PROGRESS:
        console.info(...entry.value);
        break;
      case LogLevel.SUCCESS:
        console.info(...entry.value);
        break;
      case LogLevel.WARNING:
        console.warn(...entry.value);
        break;
    }
  }

  private getMessageString(entry: Entry): string {
    if (!STRING_TABLE_TYPE.check(entry.value)) {
      return '(unsupported log format)';
    }

    return `[${entry.key}] ${entry.value.join(' ')}`;
  }

  private run(): void {
    const installTrigger = this.options.installTrigger ?? false;
    if (!installTrigger) {
      return;
    }

    Object.assign(window, {
      santa: {
        setEnabled: (enabled: unknown) => {
          this.enabled = !!enabled;
        },
      },
    });
  }
}
