import { Entry, Value } from '../component/entry';
import { formatMessage } from '../util/cli/format-message';
import { STRING_TABLE_TYPE } from '../util/string-table-type';

import { Destination } from './destination';


interface Options {
  readonly showKey: boolean;
}

export class ConsoleDestination implements Destination {
  private readonly options = applyOptions(this.inputOptions);

  constructor(private readonly inputOptions: Partial<Options> = {}) {}

  log(entry: Entry): void {
    // tslint:disable-next-line:no-console
    console.log(formatMessage(entry.level, this.getMessageString(entry)));
  }

  private getMessageString(entry: Entry): Value {
    if (this.options.showKey && STRING_TABLE_TYPE.check(entry.value)) {
      return entry.value.map(cells => [`[${entry.key}]`, ...cells]);
    }

    return entry.value;
  }
}

function applyOptions(partial: Partial<Options>): Options {
  const showKey = partial.showKey === undefined ? true : partial.showKey;
  return {showKey};
}
