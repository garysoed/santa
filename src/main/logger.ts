import { Entry } from '../component/entry';
import { LogLevel } from '../component/log-level';
import { Tag } from '../component/tag';

import { logDestination } from './log-destination';

const CONTEXT: Tag[] = [];

interface LocationModifier {
  pop(): Logger;
  push(entry: string): Logger;
}

interface ContextModifier {
  pop(): Logger;
  push(tag: Tag): Logger;
}

export class Logger {

  get context(): ContextModifier {
    return {
      pop: () => {
        CONTEXT.pop();

        return this;
      },
      push: (entry: Tag) => {
        CONTEXT.push(entry);

        return this;
      },
    };
  }

  get location(): LocationModifier {
    return {
      pop: () => {
        const newLocation = [...this.codeLocation];
        newLocation.pop();

        return new Logger(newLocation);
      },
      push: (entry: string) => {
        const newLocation = [...this.codeLocation];
        newLocation.push(entry);

        return new Logger(newLocation);
      },
    };
  }
  constructor(private readonly codeLocation: string[]) { }

  debug(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.DEBUG, key, value));
  }

  error(errorObj: Error): void {
    logDestination.get().log(this.createEntry(LogLevel.ERROR, errorObj.message, errorObj));
  }

  failure(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.FAILURE, key, value));
  }

  info(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.INFO, key, value));
  }

  progress(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.PROGRESS, key, value));
  }

  success(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.SUCCESS, key, value));
  }

  warn(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.WARNING, key, value));
  }

  private createEntry(level: LogLevel, key: string, value: unknown): Entry {
    return {
      codeLocation: [...this.codeLocation],
      context: [...CONTEXT],
      key,
      level,
      timestampMs: Date.now(),
      value,
    };
  }
}
