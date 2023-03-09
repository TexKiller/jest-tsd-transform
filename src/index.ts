import jestCreateCacheKeyFunction from "@jest/create-cache-key-function";
import { awaitAsserts } from "./utils/transform/await/asserts";
import { awaitNamespaces } from "./utils/transform/await/namespaces";
import { expectError } from "./utils/transform/expect-error";
import { importAsync, importFrom } from "./utils/transform/import";
import TsJest, { TransformOptionsTsJest } from "ts-jest";
import { env } from "process";

env.TS_JEST_DISABLE_VER_CHECKER = "1";

const tsJest = TsJest.createTransformer();

module.exports = {
  canInstrument: false,
  getCacheKey: jestCreateCacheKeyFunction(),
  process: (
    src: string | { code: string },
    filePath: string,
    options: TransformOptionsTsJest
  ) => {
    src = typeof src === "string" ? src : src.code;
    src = expectError(src);
    src = awaitAsserts(src);
    src = awaitNamespaces(src);
    src = importFrom(src);
    src = importFrom(src);
    src = importAsync(src);
    src = tsJest.process(src, filePath, options);

    return { code: src };
  },
};
