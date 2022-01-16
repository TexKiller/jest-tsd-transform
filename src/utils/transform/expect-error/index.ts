import { assertsRegexes } from "../await/asserts";

export const expectError = (src: string) => {
  let m: RegExpExecArray | null;

  const expectErrors = [];
  for (const { regex, i } of assertsRegexes) {
    while ((m = regex.exec(src))) {
      for (const assert of m[i].split(",")) {
        if (
          (
            assert.split(" as ")?.[0] ||
            assert.split(":")?.[0] ||
            assert
          ).trim() === "expectError"
        ) {
          expectErrors.push(
            (
              assert.split(" as ")?.[1] ||
              assert.split(":")?.[1] ||
              assert
            ).trim()
          );
        }
      }
    }
  }

  return expectErrors.length === 0
    ? src
    : src.replace(
        new RegExp(
          `(?<!\\w|\\d|\\.(?:[ ]*|))(?<=[ ]*|)(${expectErrors.join(
            "|"
          )})(\\s*(?:\\<[^\\(]+\\>|)\\s*\\(\\s*\\/\\/[ ]*)@ts-expect-error([^\\n]*\\n)`,
          "g"
        ),
        (_, expect, after, spaces) =>
          `${expect}${after}@ts-ignore      ${spaces}`
      );
};
