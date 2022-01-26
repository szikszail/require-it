import { join } from "path";
import { requireFrom, requireGlobal, requireIt } from "../src";

const MODULES = join(__dirname, "test-module");

describe("require-it", () => {
    test("should throw error if no package found when requiring", () => {
        expect(() => requireFrom("@scope/no-package", MODULES)).toThrow("no-package");
    });

    test("should throw error if no package found when resolving packager", () => {
        expect(() => requireFrom.resolve("@scope/no-package", MODULES)).toThrow("no-package");
    });

    test("should throw error if no package found when determining folder", () => {
        expect(() => requireFrom.directory("@scope/no-package", MODULES)).toThrow("no-package");
    });

    describe("requireIt", () => {
        beforeEach(() => {
            jest.spyOn(process, "cwd").mockReturnValue(MODULES);
        });

        test("should require direct dependecy", () => {
            expect(requireIt("foo-pkg")).toEqual({
                name: "foo-pkg",
            });
        });

        test("should resolve direct dependency", () => {
            expect(requireIt.resolve("foo-pkg")).toEqual(
                join(MODULES, "node_modules", "foo-pkg", "lib", "index.js"),
            );
        });

        test("should resolve directory of direct dependency", () => {
            expect(requireIt.directory("foo-pkg")).toEqual(
                join(MODULES, "node_modules", "foo-pkg"),
            );
        });

        test("should resolve indirect dependency", () => {
            expect(requireIt.resolve("bar-pkg")).toEqual(
                join(MODULES, "node_modules", "foo-pkg", "node_modules", "bar-pkg", "index.js"),
            );
        });

        test("should resolve directory of indirect dependency", () => {
            expect(requireIt.directory("bar-pkg")).toEqual(
                join(MODULES, "node_modules", "foo-pkg", "node_modules", "bar-pkg"),
            );
        });

        test("should resolve package which has dotted name", () => {
            expect(requireIt.resolve("dotted.package")).toEqual(
                join(MODULES, "node_modules", "dotted.package", "lib", "index.js"),
            );
        });

        test("should resolve directory of package which has dotted name", () => {
            expect(requireIt.directory("dotted.package")).toEqual(
                join(MODULES, "node_modules", "dotted.package"),
            );
        });

        test("should resolve package which name is the same as main file", () => {
            expect(requireIt.resolve("normalize.css")).toEqual(
                join(MODULES, "node_modules", "normalize.css", "normalize.css"),
            );
        });

        test("should resolve directory of package which name is the same as main file", () => {
            expect(requireIt.directory("normalize.css")).toEqual(
                join(MODULES, "node_modules", "normalize.css"),
            );
        });

        test("should resolve scoped package", () => {
            expect(requireIt.resolve("@scope/bar-pkg")).toEqual(
                join(MODULES, "node_modules", "@scope", "bar-pkg", "index.js"),
            );
        });

        test("should resolve directory of scoped package", () => {
            expect(requireIt.directory("@scope/bar-pkg")).toEqual(
                join(MODULES, "node_modules", "@scope", "bar-pkg"),
            );
        });
    });

    describe("requireFrom", () => {
        test("should require direct dependecy", () => {
            expect(requireFrom("foo-pkg", MODULES)).toEqual({
                name: "foo-pkg",
            });
        });

        test("should resolve direct dependency", () => {
            expect(requireFrom.resolve("foo-pkg", MODULES)).toEqual(
                join(MODULES, "node_modules", "foo-pkg", "lib", "index.js"),
            );
        });

        test("should resolve directory of direct dependency", () => {
            expect(requireFrom.directory("foo-pkg", MODULES)).toEqual(
                join(MODULES, "node_modules", "foo-pkg"),
            );
        });

        test("should resolve indirect dependency", () => {
            expect(requireFrom.resolve("bar-pkg", MODULES)).toEqual(
                join(MODULES, "node_modules", "foo-pkg", "node_modules", "bar-pkg", "index.js"),
            );
        });

        test("should resolve directory of indirect dependency", () => {
            expect(requireFrom.directory("bar-pkg", MODULES)).toEqual(
                join(MODULES, "node_modules", "foo-pkg", "node_modules", "bar-pkg"),
            );
        });

        test("should resolve package which has dotted name", () => {
            expect(requireFrom.resolve("dotted.package", MODULES)).toEqual(
                join(MODULES, "node_modules", "dotted.package", "lib", "index.js"),
            );
        });

        test("should resolve directory of package which has dotted name", () => {
            expect(requireFrom.directory("dotted.package", MODULES)).toEqual(
                join(MODULES, "node_modules", "dotted.package"),
            );
        });

        test("should resolve package which name is the same as main file", () => {
            expect(requireFrom.resolve("normalize.css", MODULES)).toEqual(
                join(MODULES, "node_modules", "normalize.css", "normalize.css"),
            );
        });

        test("should resolve directory of package which name is the same as main file", () => {
            expect(requireFrom.directory("normalize.css", MODULES)).toEqual(
                join(MODULES, "node_modules", "normalize.css"),
            );
        });

        test("should resolve scoped package", () => {
            expect(requireFrom.resolve("@scope/bar-pkg", MODULES)).toEqual(
                join(MODULES, "node_modules", "@scope", "bar-pkg", "index.js"),
            );
        });

        test("should resolve directory of scoped package", () => {
            expect(requireFrom.directory("@scope/bar-pkg", MODULES)).toEqual(
                join(MODULES, "node_modules", "@scope", "bar-pkg"),
            );
        });
    });

    describe("requireGlobal", () => {
        test("should require global module", () => {
            try {
                expect(requireGlobal("npm")).toBeDefined();
            } catch (e) {
                // Requiring global NPM is not possible since v8.0.0
                // But this still means requireGlobal works, as it required the global NPM
                if (!e.toString().includes("The programmatic API was removed in npm v8.0.0")) {
                    throw e;
                }
            }
        });

        test("should resolve global module", () => {
            expect(requireGlobal.resolve("npm")).toMatch(/npm.*\.js$/);
        });

        test("should resolve directory of global module", () => {
            expect(requireGlobal.directory("npm")).toMatch(/npm$/);
        });
    });
});
