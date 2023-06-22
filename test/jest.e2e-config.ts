import { type Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "../tsconfig.json";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "../src",
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testRegex: ".e2e-spec.ts$",
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "<rootDir>/../prisma/prismaTestEnvironment",

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../",
  }),
};

export default config;
