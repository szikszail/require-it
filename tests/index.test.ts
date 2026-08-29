import { join } from "node:path";

jest.mock("node:child_process", () => ({
  execSync: jest.fn(() => {
    const { join: joinPath } = require("node:path");
    return `${joinPath(__dirname, "test-module", "node_modules")}\n`;
  }),
}));

import { requireFrom, requireGlobal, requireIt } from "../src";

const MODULES = join(__dirname, "test-module");
const RESOLVERS = [
  {
    name: "requireIt",
    load: (name: string): object => requireIt(name),
    resolve: (name: string): string | undefined => requireIt.resolve(name),
    directory: (name: string): string => requireIt.directory(name),
  },
  {
    name: "requireFrom",
    load: (name: string): object => requireFrom(name, MODULES),
    resolve: (name: string): string | undefined =>
      requireFrom.resolve(name, MODULES),
    directory: (name: string): string =>
      requireFrom.directory(name, MODULES),
  },
];
const RESOLVE_CASES: Array<[string, string]> = [
  ["foo-pkg", "foo-pkg/lib/index.js"],
  ["bar-pkg", "foo-pkg/node_modules/bar-pkg/index.js"],
  ["dotted.package", "dotted.package/lib/index.js"],
  ["normalize.css", "normalize.css/normalize.css"],
  ["@scope/bar-pkg", "@scope/bar-pkg/index.js"],
];
const DIRECTORY_CASES: Array<[string, string]> = [
  ["foo-pkg", "foo-pkg"],
  ["bar-pkg", "foo-pkg/node_modules/bar-pkg"],
  ["dotted.package", "dotted.package"],
  ["normalize.css", "normalize.css"],
  ["@scope/bar-pkg", "@scope/bar-pkg"],
];

describe("require-it", () => {
  test("should throw error if no package found when requiring", () => {
    expect(() => requireFrom("@scope/no-package", MODULES)).toThrow(
      "no-package",
    );
  });

  test("should throw error if no package found when resolving packager", () => {
    expect(() => requireFrom.resolve("@scope/no-package", MODULES)).toThrow(
      "no-package",
    );
  });

  test("should throw error if no package found when determining folder", () => {
    expect(() => requireFrom.directory("@scope/no-package", MODULES)).toThrow(
      "no-package",
    );
  });

  describe.each(RESOLVERS)("$name", ({ load, resolve, directory }) => {
    beforeEach(() => {
      jest.spyOn(process, "cwd").mockReturnValue(MODULES);
    });

    test("should require direct dependecy", () => {
      expect(load("foo-pkg")).toEqual({
        name: "foo-pkg",
      });
    });

    test.each(RESOLVE_CASES)("should resolve %s", (name, relativePath) => {
      expect(resolve(name)).toEqual(join(MODULES, "node_modules", relativePath));
    });

    test("should not resolve if package does not have main", () => {
      expect(resolve("without-main")).toBeUndefined();
    });

    test.each(DIRECTORY_CASES)("should resolve directory of %s", (name, relativePath) => {
      expect(directory(name)).toEqual(join(MODULES, "node_modules", relativePath));
    });
  });

  describe("requireGlobal", () => {
    test("should require global module", () => {
      expect(requireGlobal("foo-pkg")).toEqual({
        name: "foo-pkg",
      });
    });

    test("should resolve global module", () => {
      expect(requireGlobal.resolve("foo-pkg")).toEqual(
        join(MODULES, "node_modules", "foo-pkg", "lib", "index.js"),
      );
    });

    test("should resolve directory of global module", () => {
      expect(requireGlobal.directory("foo-pkg")).toEqual(
        join(MODULES, "node_modules", "foo-pkg"),
      );
    });
  });
});
