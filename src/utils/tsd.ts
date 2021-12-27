import tsd from "tsd";
import { findIndex } from "./collections";
import type { Collection, Errors } from "./types";

export const getErrorsPromise = async (
  cwd: string,
  testFilePath: string,
  describes: Collection,
  tests: Collection
): Promise<Errors> => {
  const diagnostics = (
    await tsd({
      cwd,
      typingsFile: "node_modules/jest-tsd-transform/dist/dummy.d.ts",
      testFiles: [testFilePath],
    })
  ).filter((diagnostic) => diagnostic.severity === "error");
  const errors: Errors = {};
  for (const { message, fileName, line, column } of diagnostics) {
    if (line !== undefined) {
      const d = findIndex(line, describes);
      const t = findIndex(line, tests);
      if (!errors[d]) {
        errors[d] = {};
      }
      if (!errors[d][t]) {
        const error = new Error(message);
        error.stack = `Error: ${message}\nat ${fileName}:${line}:${
          (column || 0) + 1
        }`;
        errors[d][t] = error;
      }
    }
  }
  return errors;
};
