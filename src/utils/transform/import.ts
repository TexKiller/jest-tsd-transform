export const importFrom = (src: string) =>
  src.replace(
    /((?:\n|^|;)[ ]*)import(\s+[^;]+\s+)from\s+(["'])tsd\3(\s*;?[^\n]*)(?:\n|$)/g,
    (_, start, content, quotes, end) =>
      `${start}// @ts-ignore\nimport${content
        .split("\n")
        .join(
          "// @ts-ignore\n"
        )}from ${quotes}jest-tsd-transform/dist/asserts${quotes};${end.replace(
        ";",
        ""
      )}`
  );

export const importAsync = (src: string) =>
  src.replace(
    /((?:\n|^|;)[ ]*)const(\s+[^;]+\s*=\s*await\s+)import(\s*\(\s*)(["'])tsd\4(\s*\)[^\n]*)(?:\n|$)/g,
    (_, start, content, open, quotes, close) =>
      `${start}// @ts-ignore\nconst${content
        .split("\n")
        .join(
          "// @ts-ignore\n"
        )}import${open}${quotes}jest-tsd-transform/dist/asserts${quotes}${close}`
  );
