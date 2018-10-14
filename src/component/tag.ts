interface ValuedTag {
  key: string;
  value: string;
}
type SimpleTag = string;

export type Tag = SimpleTag|ValuedTag;
