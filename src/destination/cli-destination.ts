/* eslint-disable no-console */
import {arrayOfType, instanceofType, stringType} from 'gs-types';
import {stringify, Verbosity} from 'moirai';

import {Entry} from '../component/entry';
import {formatMessage} from '../util/cli/format-message';

import {Destination} from './destination';


interface Options {
  readonly enableFormat: boolean;
  readonly showKey: boolean;
  readonly showType: boolean;
}

type OptionsProvider = (entry: Entry) => Partial<Options>;

export class CliDestination implements Destination {
  constructor(
      private readonly optionsProvider: OptionsProvider = () => ({}),
  ) {}

  log(entry: Entry): void {
    const options = applyOptions(this.optionsProvider(entry));
    console.log(this.formatMessage(entry, options));
  }

  private formatMessage(entry: Entry, options: Options): string {
    if (!options.enableFormat) {
      const value = entry.value[0];
      stringType.assert(value);
      return value;
    }

    return formatMessage(
        entry.level,
        this.getMessageString(entry),
        {
          showPrefix: options.showType,
          key: options.showKey ? entry.key : null,
        },
    );
  }

  private getMessageString(entry: Entry): ReadonlyArray<readonly string[]> {
    if (arrayOfType(stringType).check(entry.value)) {
      return entry.value.map(line => [line]);
    }

    if (arrayOfType(instanceofType(Error)).check(entry.value)) {
      const err = entry.value[0];
      return this.getMessageString({
        ...entry,
        value: [
          err.stack ?? err.message,
        ],
      },
      );
    }

    return entry.value.map(v => [stringify(v, Verbosity.QUIET)]);
  }
}

function applyOptions(partial: Partial<Options>): Options {
  const enableFormat = partial.enableFormat === undefined ? true : partial.enableFormat;
  const showKey = partial.showKey === undefined ? true : partial.showKey;
  const showType = partial.showType === undefined ? true : partial.showType;
  return {enableFormat, showKey, showType};
}
