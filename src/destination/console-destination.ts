import { Converter } from 'gs-tools/export/converter';
import { Entry } from '../component/entry';
import { EntryType } from '../component/entry-type';
import { Destination } from './destination';

export class ConsoleDestination<E> implements Destination {
  private timestamp_: number|null = null;

  constructor(private readonly eventTypeConverter_: Converter<string, E>) { }

  private getText_(entry: Entry<E>): string {
    switch (entry.type) {
      case EntryType.DEBUG:
        return entry.message;
      case EntryType.ERROR:
        const error = entry.error;

        return `${error.message}\n${error.stack}`;
      case EntryType.EVENT:
        return this.eventTypeConverter_.convertBackward(entry.eventType);
      case EntryType.WARNING:
        return entry.message;
    }
  }

  private getTime_(timestamp: number): string {
    if (this.timestamp_ === null) {
      return '0';
    }

    const diff = timestamp - this.timestamp_;
    if (diff < 1000) {
      return `${diff}ms`;
    }

    const diffSec = Math.round(diff / 1000);

    return `${diffSec}s`;
  }

  log(entry: Entry<E>): void {
    const codeLocationArray = [...entry.codeLocation];
    const logo = getLogo_(entry.type);
    const codeLocation = codeLocationArray.join('.');
    const text = this.getText_(entry);
    const time = this.getTime_(entry.timestamp);
    const color = COLORS[getColorIndex_(codeLocationArray)];
    const method = getLoggingMethod_(entry.type);
    method.call(
        `%c${logo} [${codeLocation}] ${text} (+${time})%c`,
        `color: ${color}`,
        `color: default`);
  }
}

function getColorIndex_(codeLocation: string[]): number {
  const lastSegment = codeLocation[codeLocation.length - 1];
  if (!lastSegment) {
    return 0;
  }

  // Calculate the hash of the last segment.
  let hash = 0;
  for (let i = 0; i < lastSegment.length; i++) {
    hash += lastSegment.charCodeAt(i);
  }
  hash = hash % COLORS.length;

  const prevLocation = [...codeLocation];
  prevLocation.pop();
  const prevHash = getColorIndex_(prevLocation);

  return (hash + prevHash) % COLORS.length;
}

function getLogo_(type: EntryType): string {
  switch (type) {
    case EntryType.DEBUG:
      return `?`;
    case EntryType.ERROR:
      return `‼`;
    case EntryType.WARNING:
      return `!`;
    case EntryType.EVENT:
      return `i`;
  }
}

type ConsoleMethod = (this: Console, message?: any, ...optionalParams: any[]) => void;
function getLoggingMethod_(type: EntryType): ConsoleMethod {
  switch (type) {
    case EntryType.DEBUG:
      return console.debug;
    case EntryType.ERROR:
      return console.error;
    case EntryType.WARNING:
      return console.warn;
    case EntryType.EVENT:
      return console.info;
  }
}

const COLORS = [
  '606060', // Grey
  'c05040', // Red
  '905d30', // Orange
  '605120', // Amber
  '605f20', // Yellow
  '3d5c1f', // Lime
  '33621f', // Green
  '20603e', // Spring
  '20605e', // Cyan
  '307f90', // Sky
  '305d90', // Azure
  '405ec0', // Blue
  '6440c0', // Violet
  '7c40c0', // Purple
  'a740c0', // Magenta
  'c0408b', // Pink
];

