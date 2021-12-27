import { runTests } from "./tests";
import type { Collection, Errors } from "./types";
import { FLAVOR, Flavors, NAME } from "./types";

export const runDescribes = (
  errorsPromise: Promise<Errors>,
  describes: Collection,
  tests: Collection
) => {
  for (const d in describes) {
    const flavor = Flavors[describes[d][FLAVOR]] as keyof typeof Flavors;
    const describeFunction =
      flavor && flavor !== "todo" ? describe[flavor] : describe;
    describeFunction(describes[d][NAME], () => {
      runTests(errorsPromise, describes, tests, +d);
    });
  }
};
