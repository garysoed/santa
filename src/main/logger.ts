import { BaseEntry } from '../component/entry';
import { EntryType } from '../component/entry-type';
import { Tag } from '../component/tag';
import { logDestination } from './log-destination';

const CONTEXT: string[] = [];

interface StackModifier<E> {
  pop(): Logger<E>;
  push(entry: string): Logger<E>;
}

interface TagSetModifier<E> {
  pop(): Logger<E>;
  push(value?: string): Logger<E>;
}

export class Logger<E> {

  constructor(
      private readonly codeLocation_: string[],
      private readonly tags_: Map<string, string|null>) { }

  context(): StackModifier<E> {
    return {
      pop: () => {
        CONTEXT.pop();

        return this;
      },
      push: (entry: string) => {
        CONTEXT.push(entry);

        return this;
      },
    };
  }

  private createBaseEntry_<T extends EntryType>(type: T): BaseEntry<T> {
    const tagsSet = new Set<Tag>();
    for (const [key, value] of this.tags_) {
      const tag = value ? {key, value} : key;
      tagsSet.add(tag);
    }

    return {
      codeLocation: this.codeLocation_,
      context: [...CONTEXT],
      tags: tagsSet,
      timestamp: Date.now(),
      type,
    };
  }

  debug(message: string): void {
    const debugEntry = {
      ...this.createBaseEntry_(EntryType.DEBUG),
      message,
    };
    logDestination.get().log(debugEntry);
  }

  error(errorObj: Error): void {
    const errorEntry = {
      ...this.createBaseEntry_(EntryType.ERROR),
      error: errorObj,
    };
    logDestination.get().log(errorEntry);
  }

  event(eventType: E): void {
    const eventEntry = {
      ...this.createBaseEntry_(EntryType.EVENT),
      eventType,
    };
    logDestination.get().log(eventEntry);
  }

  location(): StackModifier<E> {
    return {
      pop: () => {
        const newLocation = [...this.codeLocation_];
        newLocation.pop();

        return new Logger(newLocation, this.tags_);
      },
      push: (entry: string) => {
        const newLocation = [...this.codeLocation_];
        newLocation.push(entry);

        return new Logger(newLocation, this.tags_);
      },
    };
  }

  tag(key: string): TagSetModifier<E> {
    return {
      pop: () => {
        const newTags = new Map([...this.tags_]);
        newTags.delete(key);

        return new Logger(this.codeLocation_, newTags);
      },
      push: (value: string = null) => {
        const newTags = new Map([...this.tags_]);
        newTags.set(key, value);

        return new Logger(this.codeLocation_, newTags);
      },
    };
  }

  warn(message: string): void {
    const warningEntry = {
      ...this.createBaseEntry_(EntryType.WARNING),
      message,
    };
    logDestination.get().log(warningEntry);
  }
}
