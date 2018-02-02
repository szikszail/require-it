var child_process = require('child_process');
var path = require('path');
var copyDir = require('copy-dir');

describe("require-it", function () {
    var requireIt;
    
    copyDir.sync(
        path.join(process.cwd(), 'test/test-module/node_modules/a'),
        path.join(process.cwd(), 'node_modules/a')
    );

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
                expect(stdout).toContain('a');
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
                expect(stdout).toContain('b');
                done();
            }
        );
    });

    it("should determine module directory", function (done) {
        child_process.execFile(
            'node',
            [path.join(process.cwd(), 'test/test-module/require-directory.js')],
            {cwd: path.join(process.cwd(), 'test/test-module')},
            function (error, stdout, stderr) {
                if (error) {
                    return done(error);
                }
                if (stderr) {
                    return done(stderr);
                }
                expect(stdout).toMatch(/a$/m);
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
                expect(stdout).toContain('@scope');
                expect(stdout).toContain('b');
                done();
            }
        );
    });
});
