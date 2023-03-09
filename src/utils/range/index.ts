import type { Range } from "../types";
import fs from "fs";

export const getRange = (e: Error): Range => {
  const s =
    e.stack
      ?.split("\n")
      .filter((l) => l.trim().startsWith("at "))[1]
      .trim() || "";
  const i1 = s.indexOf("(");
  const i2 = s.indexOf(":", i1);
  const i3 = s.indexOf(":", i2 + 1);
  const testFile = s
    .substring(i1 > -1 ? i1 + 1 : "at ".length, i2)
    .replace(/\\/g, "/");
  const line = parseInt(s.substring(i2 + 1, i3));
  const src = fs.readFileSync(testFile, { encoding: "utf-8" });
  const nextLine = /\([^\)]*$/.test(src.split("\n")[line - 1]);
  return {
    testFile,
    firstLine: line,
    lastLine: line + (nextLine ? 1 : 0),
    src,
  };
};
