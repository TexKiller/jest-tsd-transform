import jestCreateCacheKeyFunction from "@jest/create-cache-key-function";
import { awaitAsserts } from "./utils/transform/await/asserts";
import { awaitNamespaces } from "./utils/transform/await/namespaces";
import { expectError } from "./utils/transform/expect-error";
import { importAsync, importFrom } from "./utils/transform/import";

module.exports = {
  canInstrument: false,
  getCacheKey: jestCreateCacheKeyFunction(),
  process: (src: string | { code: string }) => {
    src = typeof src === "string" ? src : src.code;
    src = expectError(src);
    src = awaitAsserts(src);
    src = awaitNamespaces(src);
    src = importFrom(src);
    src = importFrom(src);
    src = importAsync(src);

    return src;
  },
};
