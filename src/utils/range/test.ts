import fs from "fs";
import { getRange } from ".";

it("detects regular range", () => {
  const { testFile, firstLine, lastLine, src } = getRange(
    (() => new Error())()
  );
  expect(testFile).toBe(__filename);
  expect(firstLine).toBe(6);
  expect(lastLine).toBe(6);
  expect(src).toBe(fs.readFileSync(__filename, { encoding: "utf-8" }));
});
