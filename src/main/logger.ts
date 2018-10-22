import { ImmutableList, ImmutableMap } from 'gs-tools/export/collect';
import { BaseEntry } from '../component/entry';
import { EntryType } from '../component/entry-type';
import { Tag } from '../component/tag';
import { logDestination } from './log-destination';

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
      private readonly codeLocation_: ImmutableList<string>,
      private readonly context_: ImmutableList<string>,
      private readonly tags_: ImmutableMap<string, string|null>) { }

  context(): StackModifier<E> {
    return {
      pop: () => new Logger(
          this.codeLocation_,
          this.context_.pop(),
          this.tags_),
      push: (entry: string) => new Logger(
          this.codeLocation_,
          this.context_.push(entry),
          this.tags_),
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
      context: this.context_,
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
      pop: () => new Logger(
          this.codeLocation_.pop(),
          this.context_,
          this.tags_),
      push: (entry: string) => new Logger(
          this.codeLocation_.push(entry),
          this.context_,
          this.tags_),
    };
  }

  tag(key: string): TagSetModifier<E> {
    return {
      pop: () => new Logger(
          this.codeLocation_,
          this.context_,
          this.tags_.deleteKey(key)),
      push: (value?: string) => new Logger(
          this.codeLocation_,
          this.context_,
          this.tags_.set(key, value || null)),
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
