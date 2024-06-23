import {Subject} from 'rxjs';

import {Entry, Value} from '../component/entry';
import {LogLevel} from '../component/log-level';

export const ON_LOG_$ = new Subject<Entry>();

const CONTEXT: Map<string, string> = new Map();

interface ContextChange {
  key: string;
  type: 'add' | 'delete';
  value: string;
}

interface NewEntry {
  readonly contextChange?: ContextChange;
  readonly level: LogLevel;
  readonly value: Value;
}

export class Logger {
  constructor(private readonly key: string) {}

  debug(...value: readonly unknown[]): void {
    this.log({level: LogLevel.DEBUG, value});
  }

  error(error: Error): void {
    this.log({level: LogLevel.ERROR, value: [error]});
  }

  info(...value: readonly unknown[]): void {
    this.log({level: LogLevel.INFO, value});
  }

  log(newEntry: NewEntry): void {
    // Adds the context BEFORE logging.
    if (newEntry.contextChange?.type === 'add') {
      CONTEXT.set(newEntry.contextChange.key, newEntry.contextChange.value);
    }

    const entry: Entry = {
      ...newEntry,
      context: CONTEXT,
      key: this.key,
      timestampMs: Date.now(),
    };

    ON_LOG_$.next(entry);

    // Removes the context AFTER logging.
    if (newEntry.contextChange?.type === 'delete') {
      CONTEXT.set(newEntry.contextChange.key, newEntry.contextChange.value);
    }
  }

  progress(...value: readonly unknown[]): void {
    this.log({level: LogLevel.PROGRESS, value});
  }

  success(...value: readonly unknown[]): void {
    this.log({level: LogLevel.SUCCESS, value});
  }

  warning(...value: readonly unknown[]): void {
    this.log({level: LogLevel.WARNING, value});
  }
}
