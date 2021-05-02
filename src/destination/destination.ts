import {Entry} from '../component/entry';

/**
 * Destination of logging.
 */
export interface Destination {
  /**
   * Logs the given entry. Implementation may buffer the entry before logging.
   */
  log(entry: Entry): void;
}
