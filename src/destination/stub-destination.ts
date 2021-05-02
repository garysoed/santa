import {Destination} from './destination';


/**
 * Does nothing.
 */
export class StubDestination implements Destination {
  log(): void {
    // No op
  }
}
