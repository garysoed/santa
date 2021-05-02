/* eslint-disable no-console */
import {Entry} from '../component/entry';
import {LogLevel} from '../component/log-level';

import {Destination} from './destination';


interface Options {
  readonly installTrigger: boolean;
}

const STORAGE_KEY = 'santa.enableLog';

export class WebConsoleDestination implements Destination {
  private enabled = !!localStorage.getItem(STORAGE_KEY);
  constructor(
      private readonly options: Partial<Options> = {},
  ) {
    this.run();
  }

  log(entry: Entry): void {
    if (!this.enabled) {
      return;
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(entry.key, ...entry.value);
        break;
      case LogLevel.ERROR:
        console.error(entry.key, ...entry.value);
        break;
      case LogLevel.FAILURE:
        console.warn(entry.key, ...entry.value);
        break;
      case LogLevel.INFO:
        console.info(entry.key, ...entry.value);
        break;
      case LogLevel.PROGRESS:
        console.info(entry.key, ...entry.value);
        break;
      case LogLevel.SUCCESS:
        console.info(entry.key, ...entry.value);
        break;
      case LogLevel.WARNING:
        console.warn(entry.key, ...entry.value);
        break;
    }
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
          localStorage.setItem(STORAGE_KEY, enabled ? 'true' : '');
        },
      },
    });
  }
}
