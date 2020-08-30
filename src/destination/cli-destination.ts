import { stringType, tupleOfType, Type } from 'gs-types';

import { Entry, Value } from '../component/entry';
import { formatMessage } from '../util/cli/format-message';
import { STRING_TABLE_TYPE } from '../util/string-table-type';

import { Destination } from './destination';


interface Options {
  readonly enableFormat: boolean;
  readonly showKey: boolean;
  readonly showType: boolean;
}

type OptionsProvider = (entry: Entry) => Partial<Options>;
const STRING_VALUE_TYPE: Type<[[string]]> =
    tupleOfType<[[string]]>([tupleOfType<[string]>([stringType])]);

export class CliDestination implements Destination {
  constructor(
      private readonly optionsProvider: OptionsProvider = () => ({}),
  ) {}

  log(entry: Entry): void {
    const options = applyOptions(this.optionsProvider(entry));
    // tslint:disable-next-line:no-console
    console.log(this.formatMessage(entry, options));
  }

  private formatMessage(entry: Entry, options: Options): string {
    if (!options.enableFormat) {
      STRING_VALUE_TYPE.assert(entry.value);
      return entry.value[0][0];
    }

    return formatMessage(
        entry.level,
        this.getMessageString(entry, options),
        {showPrefix: options.showType},
    );
  }

  private getMessageString(entry: Entry, options: Options): Value {
    if (options.showKey && STRING_TABLE_TYPE.check(entry.value)) {
      return entry.value.map(cells => [`[${entry.key}]`, ...cells]);
    }

    return entry.value;
  }
}

function applyOptions(partial: Partial<Options>): Options {
  const enableFormat = partial.enableFormat === undefined ? true : partial.enableFormat;
  const showKey = partial.showKey === undefined ? true : partial.showKey;
  const showType = partial.showType === undefined ? true : partial.showType;
  return {enableFormat, showKey, showType};
}
