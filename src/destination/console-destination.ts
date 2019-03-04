import { stringify, Verbosity } from 'moirai/export';
import { Entry } from '../component/entry';
import { LogLevel } from '../component/log-level';
import { Destination } from './destination';

export class ConsoleDestination implements Destination {
  private timestamp_: number|null = null;

  private getTime(timestamp: number): string {
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

  log(entry: Entry): void {
    const codeLocationArray = [...entry.codeLocation];
    const codeLocation = codeLocationArray.join('.');
    const time = this.getTime(entry.timestampMs);
    const color = COLORS[getColorIndex(codeLocationArray)];
    const method = getLoggingMethod(entry.level);
    this.timestamp_ = entry.timestampMs;
    method.call(
        console,
        `%c[${codeLocation}] ${entry.key}: ${stringify(entry.value, Verbosity.DEBUG)} (+${time})%c`,
        `color: #${color}`,
        `color: default`);
  }
}

function getColorIndex(codeLocation: string[]): number {
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
  const prevHash = getColorIndex(prevLocation);

  return (hash + prevHash) % COLORS.length;
}

type ConsoleMethod = (this: Console, message?: any, ...optionalParams: any[]) => void;
function getLoggingMethod(logLevel: LogLevel): ConsoleMethod {
  switch (logLevel) {
    case LogLevel.DEBUG:
      return console.debug;
    case LogLevel.ERROR:
      return console.error;
    case LogLevel.INFO:
      return console.info;
    case LogLevel.LOG:
      return console.log;
    case LogLevel.WARNING:
      return console.warn;
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

