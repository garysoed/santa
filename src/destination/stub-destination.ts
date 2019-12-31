import { Entry } from '../component/entry';

import { Destination } from './destination';

/**
 * Does nothing.
 */
export class StubDestination implements Destination {
  log(entry: Entry): void {
    // No op
  }
}
