import { LogLevel } from './log-level';

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
  readonly value: unknown;
}
