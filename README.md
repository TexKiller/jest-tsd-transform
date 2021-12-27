# Jest TSD Transform

A [Jest](https://jestjs.io/) transform library used to run `test-d.ts` tests using [tsd](https://github.com/SamVerschueren/tsd).

## Overview

Jest TSD Transform can be configured as a transform in [Jest](https://jestjs.io/) to execute [tsd](https://github.com/SamVerschueren/tsd) tests as suites of [Jest](https://jestjs.io/) tests, providing a uniform display of test results that includes both typing tests and regular tests.

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
  transform: {
    "^.+(\\.|\\/)(test-d\\.ts)$": "jest-tsd-transform",
  },
  testMatch: ["<rootDir>/**/*test.ts", "<rootDir>/**/*test-d.ts"],
```

### Create typing tests

If you modify the [Jest](https://jestjs.io/) configuration as proposed above, any files in the project ending with `test-d.ts` will be run as tests by Jest TSD Transform.

Bellow is an example of such tests:

```typescript
import { expectType } from "tsd";

declare const concat: {
  (value1: string, value2: string): string;
  (value1: number, value2: number): number;
};

it("concatenates strings", () => {
  expectType<string>(concat("foo", "bar"));
});

it("concatenates numbers", () => {
  expectType<string>(concat(1, 2));
});
```

Running the test above produces the following results:

```typescript
 FAIL  ./sample.test-d.ts (14.333 s)
  ✓ concatenates strings (11797 ms)
  ✕ concatenates numbers

  ● concatenates numbers

    Argument of type 'number' is not assignable to parameter of type 'string'.

      11 |
      12 | it("concatenates numbers", () => {
    > 13 |   expectType<string>(concat(1, 2));
         |                      ^
      14 | });
      15 |

      at sample.test-d.ts:13:22

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        15.148 s
Ran all test suites.
npm ERR! Test failed.  See above for more details.
```

## Limitations

- Test names are expected to be literal strings in the same line of the test function call (like `it("test name", () => {`). Line breaks inside template literals or test names from variables will break the parsing and produce unexpected results.
- [Jest](https://jestjs.io/)'s `.each(table)` method is not supported in typing tests. It would be very hard to get [tsd](https://github.com/SamVerschueren/tsd) to properly extract the types from the table, and I don't think this feature is worth that additional complexity.
- `import type {...} from ...` statements are supported by [tsd](https://github.com/SamVerschueren/tsd), but [Jest](https://jestjs.io/)'s dependency resolver ignores those lines, so it is preferable to instead use `import {...} from ...` on typing test files to import types.
- The parsing of [Jest](https://jestjs.io/) keywords is very naive. That allows the code to be simpler and easier to understand, but typing errors that happen outside of tests might show up inside tests, and tests outside `describe` blocks might show up inside them. In case of problems try to keep all assertions inside tests, and if you use `describe` blocks try to keep each test inside one of these blocks.
