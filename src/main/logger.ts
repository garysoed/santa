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
  constructor(private readonly codeLocation: string[]) { }

  get context(): ContextModifier {
    return {
      pop() {
        CONTEXT.pop();

        return this;
      },
      push(entry: Tag) {
        CONTEXT.push(entry);

        return this;
      },
    };
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

  debug(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.DEBUG, key, value));
  }

  error(errorObj: Error): void {
    logDestination.get().log(this.createEntry(LogLevel.ERROR, errorObj.message, errorObj));
  }

  info(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.INFO, key, value));
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

  log(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.LOG, key, value));
  }

  warn(key: string, value: unknown): void {
    logDestination.get().log(this.createEntry(LogLevel.WARNING, key, value));
  }
}
