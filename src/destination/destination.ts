import { BaseEntry } from '../component/entry';
import { EntryType } from '../component/entry-type';

export interface Destination {
  /**
   * Flushes all buffered entries, if any.
   */
  flush(): void;

  /**
   * Logs the given entry. Implementation may buffer the entry before logging.
   */
  log(entry: BaseEntry<EntryType>): void;
}
