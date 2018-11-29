var proxyquire = require('proxyquire');
var {join, normalize} = require('path');
var requireIt = proxyquire('../../index', {
    "child_process": {
        execSync: () => normalize(join(__dirname, '..', 'global'))
    }
});

var a = requireIt.global('foo-pkg');
console.log(a.name);