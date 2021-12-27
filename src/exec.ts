import path from "path";
import { runDescribes } from "./utils/describes";
import { runDefaultTest, runTests } from "./utils/tests";
import { getErrorsPromise } from "./utils/tsd";
import type { Collection } from "./utils/types";

export const exec = (
  cwd: string,
  testFile: string,
  describes: Collection,
  tests: Collection
) => {
  const testFilePath = path.relative(cwd, testFile);
  const errorsPromise = getErrorsPromise(cwd, testFilePath, describes, tests);
  if (tests.length === 0) {
    runDefaultTest(errorsPromise, testFilePath);
  } else {
    runTests(errorsPromise, describes, tests, -1);
  }
  runDescribes(errorsPromise, describes, tests);
};
