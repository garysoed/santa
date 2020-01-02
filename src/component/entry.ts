import * as commandLineUsage from 'command-line-usage';

import { LogLevel } from './log-level';

export type Value = ReadonlyArray<readonly string[]>|commandLineUsage.Section[];

/**
 * Entry in the log.
 */
export interface Entry {
  readonly context: ReadonlyMap<string, string>;
  /**
   * The type of the log.
   */
  readonly key: string;
  readonly level: LogLevel;
  readonly timestampMs: number;
  readonly value: Value;
}
