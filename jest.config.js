module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    "^.*\\.ts$": "ts-jest",
  },
  testMatch: ["<rootDir>/**/*test.ts"],
};
