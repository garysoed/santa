import * as commandLineUsage from 'command-line-usage';
import { arrayOfType, StringType, Type } from 'gs-types';
import { Subject } from 'rxjs';

import { Entry, Value } from '../component/entry';
import { LogLevel } from '../component/log-level';
import { STRING_TABLE_TYPE } from '../util/string-table-type';


export const ON_LOG_$ = new Subject<Entry>();

const CONTEXT: Map<string, string> = new Map();

interface ContextChange {
  key: string;
  type: 'add'|'delete';
  value: string;
}

type RawValue = string|readonly string[]|
    ReadonlyArray<readonly string[]>|commandLineUsage.Section[];

interface NewEntry {
  readonly contextChange?: ContextChange;
  readonly level: LogLevel;
  readonly value: RawValue;
}

export class Logger {
  constructor(private readonly key: string) {}

  error(error: Error): void {
    let value: string;
    if (error.stack) {
      value = error.stack
          .split('\n')
          .map((line, index) => {
            if (index <= 0) {
              return line;
            }

            return line.replace(
                /^( )*/,
                match => {
                  return match.replace(/ /g, '.');
                });
          })
          .join('\n');
    } else {
      value = error.message;
    }
    this.log({level: LogLevel.ERROR, value});
  }

  info(value: RawValue): void {
    this.log({level: LogLevel.INFO, value});
  }

  log(newEntry: NewEntry): void {
    // Adds the context BEFORE logging.
    if (newEntry.contextChange && newEntry.contextChange.type === 'add') {
      CONTEXT.set(newEntry.contextChange.key, newEntry.contextChange.value);
    }

    const value = normalizeValue(newEntry.value);

    const entry: Entry = {
      ...newEntry,
      context: CONTEXT,
      key: this.key,
      timestampMs: Date.now(),
      value,
    };

    ON_LOG_$.next(entry);

    // Removes the context AFTER logging.
    if (newEntry.contextChange && newEntry.contextChange.type === 'delete') {
      CONTEXT.set(newEntry.contextChange.key, newEntry.contextChange.value);
    }
  }

  progress(value: RawValue): void {
    this.log({level: LogLevel.PROGRESS, value});
  }

  success(value: RawValue): void {
    this.log({level: LogLevel.SUCCESS, value});
  }

  warning(value: RawValue): void {
    this.log({level: LogLevel.WARNING, value});
  }
}

const STRING_ARRAY_TYPE: Type<readonly string[]> = arrayOfType(StringType);

function normalizeValue(raw: RawValue): Value {
  if (typeof raw === 'string') {
    return raw.split('\n').map(row => [row]);
  }

  if (STRING_ARRAY_TYPE.check(raw)) {
    return raw.map(row => [row]);
  }

  if (STRING_TABLE_TYPE.check(raw)) {
    return raw;
  }

  return raw;
}
