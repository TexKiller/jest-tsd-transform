import type { Collection, Pattern } from "./types";
import { Flavors, LINE } from "./types";

export const extractCollection = <
  P extends Pattern<P> & Record<string, string[]>
>(
  lines: [number, string][],
  pattern: P
): Collection => {
  const patterns = Object.entries(pattern)
    .map(([k, ps]) => ps.map((p) => [p, +k] as [string, Flavors]))
    .flat();
  return lines
    .filter(([, l]) => patterns.find(([p]) => l.startsWith(p)))
    .map(([i, l]) => {
      const flavor = patterns.find(([p]) => l.startsWith(p))?.[1] || 0;
      const name = l.substring(
        l.indexOf("(") + 1,
        l.lastIndexOf(flavor === Flavors.todo ? ")" : ",")
      );
      return [i, name, flavor];
    });
};

export const findIndex = (line: number, collection: Collection) => {
  let i = -1;
  while (i < collection.length - 1 && line >= collection[i + 1][LINE]) {
    i++;
  }
  return i;
};
