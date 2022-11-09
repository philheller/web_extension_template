import type { Config } from "jest";

export default {
  verbose: true,
  roots: ["./src/"],
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  // consider adding threshholds
  // coverageThreshhold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10,
  //   },
  // },
} as Config;
