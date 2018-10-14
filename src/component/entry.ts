import { EntryType } from './entry-type';
import { Tag } from './tag';

export interface BaseEntry<T extends EntryType> {
  codeLocation: Iterable<string>;
  context: Iterable<string>;
  tags: Set<Tag>;
  timestamp: number;
  type: T;
}

export interface DebugEntry extends BaseEntry<EntryType.DEBUG> {
  message: string;
}

export interface EventEntry<E> extends BaseEntry<EntryType.EVENT> {
  eventType: E;
}

export interface ErrorEntry extends BaseEntry<EntryType.ERROR> {
  error: Error;
}

export interface WarningEntry extends BaseEntry<EntryType.WARNING> {
  message: string;
}

export type Entry<E> = DebugEntry|EventEntry<E>|ErrorEntry|WarningEntry;