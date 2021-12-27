import type { Collection, Errors } from "./types";
import { FLAVOR, Flavors, LINE, NAME } from "./types";

export const runDefaultTest = (
  errorsPromise: Promise<Errors>,
  testFilePath: string
) => {
  it(testFilePath, async () => {
    const errors = await errorsPromise;
    for (const d of Object.keys(errors)) {
      if (errors[+d]?.[-1]) {
        throw errors[+d]?.[-1];
      }
    }
  });
};

const runTest =
  (errorsPromise: Promise<Errors>, d: number, t: number) => async () => {
    const errors = await errorsPromise;
    const error = errors[-1]?.[-1] || errors[d]?.[-1] || errors[d]?.[t];
    if (error) {
      throw error;
    }
  };

export const runTests = (
  errorsPromise: Promise<Errors>,
  describes: Collection,
  tests: Collection,
  d: number
) => {
  for (const t in tests) {
    if (
      (d === -1 || tests[t][LINE] >= describes[d][LINE]) &&
      (d === describes.length - 1 || tests[t][LINE] < describes[d + 1][LINE])
    ) {
      const flavor = Flavors[tests[t][FLAVOR]] as keyof typeof Flavors;
      const testFunction = flavor ? test[flavor] : test;
      if (flavor === "todo") {
        testFunction(tests[t][NAME]);
      } else {
        testFunction(tests[t][NAME], runTest(errorsPromise, d, +t));
      }
    }
  }
};
