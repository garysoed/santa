import { LogLevel } from './log-level';
import { Tag } from './tag';

/**
 * Entry in the log.
 */
export interface Entry {
  codeLocation: Iterable<string>;
  context: Tag[];
  key: string;
  level: LogLevel;
  timestampMs: number;
  value: unknown;
}
