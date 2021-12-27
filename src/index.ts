// @ts-ignore
import { transform } from "@babel/core";
import jestCreateCacheKeyFunction from "@jest/create-cache-key-function";
import type { Config } from "@jest/types";
// @ts-ignore
import jestPreset from "babel-preset-jest";
import { extractCollection } from "./utils/collections";
import { Flavors } from "./utils/types";

const DESCRIBES = {
  [Flavors[""]]: ["describe("],
  [Flavors.only]: ["describe.only(", "fdescribe("],
  [Flavors.skip]: ["describe.skip(", "xdescribe("],
};

const TESTS = {
  [Flavors[""]]: ["test(", "it("],
  [Flavors.only]: ["test.only(", "it.only(", "fit("],
  [Flavors.skip]: ["test.skip(", "it.skip(", "xtest(", "xit("],
  [Flavors.todo]: ["test.todo(", "it.todo("],
};

module.exports = {
  canInstrument: false,
  getCacheKey: jestCreateCacheKeyFunction(),
  process: (
    src: string,
    filePath: Config.Path,
    config: { config: Config.ProjectConfig } & Config.ProjectConfig
  ) => {
    const jestConfig = config.config || config;
    const lines = src
      .split("\n")
      .map((l, i) => [i + 1, l.trim()] as [number, string]);
    const describes = extractCollection(lines, DESCRIBES);
    const tests = extractCollection(lines, TESTS);
    const testFile = `
      const exec = require('jest-tsd-transform/dist/exec').exec;
      exec(${JSON.stringify(jestConfig.cwd)}, ${JSON.stringify(
      filePath
    )}, [${describes
      .map((arr) => "[" + arr.join(",") + "]")
      .join(",")}], [${tests
      .map((arr) => "[" + arr.join(",") + "]")
      .join(",")}])
    `;

    const transformedFile = transform(testFile, {
      filename: filePath,
      presets: [jestPreset],
      root: jestConfig.cwd,
    });

    return transformedFile ? transformedFile.code : src;
  },
};
