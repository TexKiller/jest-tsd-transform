export const LINE = 0;
export const NAME = 1;
export const FLAVOR = 2;

export type Collection = [number, string, Flavors][];

export type Errors = Record<number, Record<number, Error>>;

export enum Flavors {
  "",
  "only",
  "skip",
  "todo",
}

export type Pattern<P> = {
  [k in keyof P as k extends Flavors ? k : never]: P[k];
};
