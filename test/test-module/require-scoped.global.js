var proxyquire = require('proxyquire');
var {join, normalize} = require('path');
var requireIt = proxyquire('../../index', {
    "child_process": {
        execSync: () => normalize(join(__dirname, '..', 'global'))
    }
});
console.log(requireIt.global.directory('@scope/bar-pkg'));