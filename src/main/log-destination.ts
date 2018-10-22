import { Destination } from '../destination/destination';
import { StubDestination } from '../destination/stub-destination';

let destination = new StubDestination();

export const logDestination = {
  get(): Destination {
    return destination;
  },

  set(newDestination: Destination): void {
    destination = newDestination;
  },
};
