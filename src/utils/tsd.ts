import path from "path";
import tsd from "tsd";
import type { Diagnostic } from "tsd/dist/lib/interfaces";
import type { Range } from "./types";

const cwd = path.resolve(__dirname, "../..");

const _diagnostics: Record<string, Diagnostic[]> = {};
const getDiagnostics = async (testFile: string) => {
  if (!_diagnostics[testFile]) {
    _diagnostics[testFile] = await tsd({
      cwd,
      typingsFile: "dist/dummy.d.ts",
      testFiles: [path.relative(cwd, testFile)],
    });
  }
  return _diagnostics[testFile];
};

export const throwTypingError = async ({
  testFile,
  firstLine,
  lastLine,
  src,
}: Range) => {
  const diags = (await getDiagnostics(testFile)).filter(
    (d) =>
      d.fileName === testFile &&
      d.line !== undefined &&
      d.line >= firstLine &&
      d.line <= lastLine
  );
  const diagnostics = diags.filter(
    (d) =>
      d.message !== "Expected an error, but found none." ||
      !/^[^\n]*(?:\/\/[\/ ]*@ts-expect-error[^\n]*\n|\n[^\(]*\(\s*\/\/[\/ ]*@ts-expect-error)/.test(
        src
          .split("\n")
          .slice(Math.max(0, d.line! - 2))
          .join("\n")
          .substring(d.column || 0)
      )
  );
  const error = diagnostics.find((d) => d.severity !== "warning");
  if (error) {
    const { severity, message, line, column } = error;
    const e = new Error("");
    e.stack = `${
      severity.substring(0, 1).toUpperCase() + severity.substring(1)
    }: ${
      diags.find((d) => d.message === "Expected an error, but found none.") &&
      message === "Unused '@ts-expect-error' directive."
        ? "Expected an error, but found none."
        : message
    }\nat ${testFile}:${line}:${(column || 0) + 1}`;
    throw e;
  }
  return diagnostics.map((d) => d.message).join("\n");
};
