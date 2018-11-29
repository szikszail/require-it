var child_process = require('child_process');
var path = require('path');
var copyDir = require('copy-dir');
var sinon = require('sinon');
var requireIt = require('../index');

describe("require-it", function () {
    var requireIt;
    
    beforeEach(function () {
        requireIt = require('../index');
    });

    it("should define itself", function () {
        expect(requireIt).toBeDefined();
    });

    it("should define resolve", function () {
        expect(requireIt.resolve).toBeDefined();
    });

    it("should require direct dependencies", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-dependency.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain('foo-pkg');
                done();
            }
        );
    });

    it("should require global dependencies", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-dependency.global.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain('foo-pkg-global');
                done();
            }
        );
    });

    it("should require nested dependencies", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-nested-dependency.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).not.toContain('@scope');
                expect(stdout).toContain('bar-pkg');
                done();
            }
        );
    });

    it("should determine module directory", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-directory.js')],
            {cwd: path.join(process.cwd(), 'test', 'test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain(path.join(process.cwd(), 'test', 'test-module', 'node_modules', 'foo-pkg'));
                done();
            }
        );
    });

    it("should work in that case when main file is the same as package name", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-directory.samemain.js')],
            {cwd: path.join(process.cwd(), 'test', 'test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain(path.join(process.cwd(), 'test', 'test-module', 'node_modules', 'normalize.css'));
                done();
            }
        );
    });

    it("should determine global module directory", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-directory.global.js')],
            {cwd: path.join(process.cwd(), 'test', 'test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain(path.join(process.cwd(), 'test', 'global', 'node_modules', 'foo-pkg'));
                done();
            }
        );
    });

    it("should throw error if called with non-existing dependencies", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-not-exist-dependency.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                expect(stderr).toBeDefined();
                done();
            }
        );
    });

    it("should work with scoped packages too", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-scoped.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain(path.join(process.cwd(), 'test', 'test-module', 'node_modules', '@scope', 'bar-pkg'));
                done();
            }
        );
    });

    it("should work with global scoped packages too", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-scoped.global.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain(path.join(process.cwd(), 'test', 'global', 'node_modules', '@scope', 'bar-pkg'));
                done();
            }
        );
    });

    it("should handle special paths", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-dotted.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toContain(process.cwd());
                expect(stdout).toContain('zen-pkg');
                done();
            }
        );
    });
});
