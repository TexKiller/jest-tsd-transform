# Jest TSD Transform

A [Jest](https://jestjs.io/) transform library used to execute type assertions using [tsd](https://github.com/SamVerschueren/tsd).

## Overview

Jest TSD Transform can be configured as a transform in [Jest](https://jestjs.io/) to execute [tsd](https://github.com/SamVerschueren/tsd) assertions inside suites of [Jest](https://jestjs.io/) tests, providing a uniform display of test results that includes both typing and regular tests.

## Motivation

TypeScript provides us with many typing features. While that is great for the flexibility, the added complexity can sometimes lead to bugs in the typing behavior - something that can be mitigated by properly testing the types. [Jest](https://jestjs.io/) is a very popular testing framework, but using it to test TypeScript's types is not trivial as the typing information is lost during compilation. [tsd](https://github.com/SamVerschueren/tsd) provides a way to evaluate types, detecting typing errors and evaluating typing assertions, but using two separate testing frameworks introduces inconsistencies and makes it harder to deal with test results.

## Getting Started

The following steps show how to set up Jest TSD Transform on a [Jest](https://jestjs.io/) project.

### Install Jest TSD Transform:

Using npm:

```sh
npm install jest-tsd-transform --save-dev
```

Using yarn:

```sh
yarn add jest-tsd-transform --dev
```

### Add the following to your Jest configuration:

```javascript
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    "^.*(\\.|\\/)(test\\.ts)$": "jest-tsd-transform",
  },
  testMatch: ["<rootDir>/**/*test.ts"],
```

If you use the [Jest](https://jestjs.io/) configuration proposed above, any files in the project ending with `test.ts` will be transformed by Jest TSD Transform to support typing assertions.

### Use typing assertions in tests:

You can use any of [tsd](https://github.com/SamVerschueren/tsd)'s type assertions in asynchronous tests:

```typescript
import { expectType, expectError } from "tsd";

const concat: {
  (value1: string, value2: string): string;
  (value1: number, value2: number): number;
} = (v1: any, v2: any) => v1 + v2;

describe("concatenating strings", () => {
  it("returns string", async () => {
    expectType<string>(concat("foo", "bar"));
  });
  it("works", () => {
    expect(concat("foo", "bar")).toBe("foobar");
  });
});

describe("concatenating numbers", () => {
  it("returns string", async () => {
    expectType<string>(concat(1, 2));
  });
  it("works", () => {
    expect(concat(1, 2)).toBe("12");
  });
});

describe("concatenating booleans", () => {
  it("rejects boolean parameters", async () => {
    expectError(
      // @ts-expect-error
      concat("foo", false)
    );
    // @ts-expect-error
    expectError(concat(true, false));
  });
});
```

Running the test suite above produces the following results:

```typescript
 FAIL  ./sample.test.ts (12.672 s)
  concatenating strings
    ✓ returns string (8176 ms)
    ✓ works (13 ms)
  concatenating numbers
    ✕ returns string (7 ms)
    ✕ works (9 ms)
  concatenating booleans
    ✓ rejects boolean parameters (4 ms)

  ● concatenating numbers › returns string

    Argument of type 'number' is not assignable to parameter of type 'string'.

      17 | describe("concatenating numbers", () => {
      18 |   it("returns string", async () => {
    > 19 |     expectType<string>(concat(1, 2));
         |                        ^
      20 |   });
      21 |   it("works", () => {
      22 |     expect(concat(1, 2)).toBe("12");

      at sample.test.ts:19:24

  ● concatenating numbers › works

    expect(received).toBe(expected) // Object.is equality

    Expected: "12"
    Received: 3

      20 |   });
      21 |   it("works", () => {
    > 22 |     expect(concat(1, 2)).toBe("12");
         |                          ^
      23 |   });
      24 | });
      25 |

      at Object.<anonymous> (sample.test.ts:22:26)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 3 passed, 5 total
Snapshots:   0 total
Time:        12.858 s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

## Limitations

- The test functions have to be asynchronous (with the `async` keyword) to support typing assertions.
- `import type {...} from ...` statements are supported by [tsd](https://github.com/SamVerschueren/tsd), but [Jest](https://jestjs.io/)'s dependency resolver ignores those lines, so it is preferable to use `import {...} from ...` on typing test files to import types instead.
