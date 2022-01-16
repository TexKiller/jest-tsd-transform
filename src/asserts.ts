import * as asserts from "tsd";
import { getRange } from "./utils/range";
import { throwTypingError } from "./utils/tsd";

const assert = () => {
  const e = new Error();
  const range = getRange(e);
  return throwTypingError(range);
};

module.exports = Object.fromEntries(
  Object.keys(asserts).map((key) => [
    key,
    key === "default" ? asserts[key] : assert,
  ])
);
