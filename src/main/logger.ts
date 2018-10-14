import { ImmutableList, ImmutableMap, ImmutableSet } from 'gs-tools/export/collect';
import { BaseEntry, DebugEntry, EventEntry } from '../component/entry';
import { EntryType } from '../component/entry-type';
import { Tag } from '../component/tag';
import { Destination } from '../destination/destination';

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
      private readonly destination_: Destination,
      private readonly tags_: ImmutableMap<string, string|null>) { }

  context(): StackModifier<E> {
    return {
      pop: () => new Logger(
          this.codeLocation_,
          this.context_.pop(),
          this.destination_,
          this.tags_),
      push: (entry: string) => new Logger(
          this.codeLocation_,
          this.context_.push(entry),
          this.destination_,
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
      context: this.context_,
      location: this.codeLocation_,
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
    this.destination_.log(debugEntry);
  }

  error(errorObj: Error): void {
    const errorEntry = {
      ...this.createBaseEntry_(EntryType.ERROR),
      error: errorObj,
    };
    this.destination_.log(errorEntry);
  }

  event(eventType: E): void {
    const eventEntry = {
      ...this.createBaseEntry_(EntryType.EVENT),
      eventType,
    };
    this.destination_.log(eventEntry);
  }

  location(): StackModifier<E> {
    return {
      pop: () => new Logger(
          this.codeLocation_.pop(),
          this.context_,
          this.destination_,
          this.tags_),
      push: (entry: string) => new Logger(
          this.codeLocation_.push(entry),
          this.context_,
          this.destination_,
          this.tags_),
    };
  }

  tag(key: string): TagSetModifier<E> {
    return {
      pop: () => new Logger(
          this.codeLocation_,
          this.context_,
          this.destination_,
          this.tags_.deleteKey(key)),
      push: (value?: string) => new Logger(
          this.codeLocation_,
          this.context_,
          this.destination_,
          this.tags_.set(key, value || null)),
    };
  }

  warn(message: string): void {
    const warningEntry = {
      ...this.createBaseEntry_(EntryType.WARNING),
      message,
    };
    this.destination_.log(warningEntry);
  }
}
