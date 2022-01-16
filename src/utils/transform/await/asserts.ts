import { addAwait } from ".";

export const assertsRegexes = [
  {
    regex:
      /(?:\n|^|;)[ ]*import\s*\{([^;\}]+)\}\s*from\s*(["'])tsd\2\s*;?[^\n]*(?:\n|$)/g,
    i: 1,
  },
  {
    regex:
      /(?:\n|^|;)[ ]*const\s*\{([^\}]+)\}\s*=\s*await\s+import\s*\(\s*(["'])tsd\2\s*\)[^\n]*(?:\n|$)/g,
    i: 1,
  },
];

export const awaitAsserts = (src: string) => {
  let m: RegExpExecArray | null;

  const asserts = [];
  for (const { regex, i } of assertsRegexes) {
    while ((m = regex.exec(src))) {
      for (const assert of m[i].split(",")) {
        if (
          assert.trim().length > 0 &&
          (
            assert.split(" as ")?.[0] ||
            assert.split(":")?.[0] ||
            assert
          ).trim() !== "default"
        ) {
          asserts.push(
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

  return asserts.length === 0
    ? src
    : src.replace(
        new RegExp(
          `(?<!\\w|\\d|\\.)([ ]*|)(${asserts.join(
            "|"
          )})\\s*(?:\\<[^\\(]+\\>|)\\s*\\(`,
          "g"
        ),
        (_, spaces, assert) => addAwait(spaces, assert)
      );
};
