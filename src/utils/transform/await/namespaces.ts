import { addAwait } from ".";
import * as originalAsserts from "../../../asserts";

const namespacesRegexes = [
  {
    regex:
      /(?:\n|^|;)[ ]*import\s+\*\s*as\s+(\w+)\s+from\s*(["'])tsd\2\s*;?[^\n]*(?:\n|$)/g,
    i: 1,
  },
  {
    regex:
      /(?:\n|^|;)[ ]*const\s+(\w+)\s*=\s*await\s+import\s*\(\s*(["'])tsd\2\s*\)[^\n]*(?:\n|$)/g,
    i: 1,
  },
];

export const awaitNamespaces = (src: string) => {
  let m: RegExpExecArray | null;

  const namespaces = [];
  for (const { regex, i } of namespacesRegexes) {
    while ((m = regex.exec(src))) {
      namespaces.push(m[i]);
    }
  }

  return namespaces.length === 0
    ? src
    : src.replace(
        new RegExp(
          `(?<!\\w|\\d|\\.)([ ]*|)((?:${namespaces.join("|")})\.)(${Object.keys(
            originalAsserts
          )
            .filter((a) => a !== "default")
            .join("|")})\\s*(?:\\<[^\\(]+\\>|)\\s*\\(`,
          "g"
        ),
        (_, spaces, obj, assert) => addAwait(spaces, assert, obj)
      );
};
