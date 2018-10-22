import { Entry } from '../component/entry';

export interface Destination {
  /**
   * Logs the given entry. Implementation may buffer the entry before logging.
   */
  log(entry: Entry<any>): void;
}
