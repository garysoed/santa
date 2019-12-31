import { Entry } from '../component/entry';
import { LogLevel } from '../component/log-level';
import { Destination } from '../destination/destination';

const CONTEXT: Map<string, string> = new Map();

interface ContextChange {
  type: 'add'|'delete';
  key: string;
  value: string;
}

interface NewEntry {
  readonly contextChange?: ContextChange;
  readonly level: LogLevel;
  readonly value: unknown;
}

export class Logger {
  constructor(
      private readonly destinations: ReadonlySet<Destination>,
      private readonly key: string,
  ) {}

  log(newEntry: NewEntry): void {
    // Adds the context BEFORE logging.
    if (newEntry.contextChange && newEntry.contextChange.type === 'add') {
      CONTEXT.set(newEntry.contextChange.key, newEntry.contextChange.value);
    }

    const entry: Entry = {
      ...newEntry,
      context: CONTEXT,
      key: this.key,
      timestampMs: Date.now(),
    };

    for (const destination of this.destinations) {
      destination.log(entry);
    }

    // Removes the context AFTER logging.
    if (newEntry.contextChange && newEntry.contextChange.type === 'delete') {
      CONTEXT.set(newEntry.contextChange.key, newEntry.contextChange.value);
    }
  }

  withKey(key: string): Logger {
    return new Logger(this.destinations, key);
  }
}
