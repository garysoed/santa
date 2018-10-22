import { Entry } from '../component/entry';
import { Destination } from './destination';

export class StubDestination implements Destination {
  log(entry: Entry<any>): void {
    // No op
  }
}
