'use strict';

var path = require('path');
var fs = require('fs');

var utils = require('./utils');

var RequireIt = function () {
    var requireIt = function (module) {
        return require(requireIt.resolve(module));
    };

    requireIt.resolve = function (module) {
        var pathToModule;

        function checkNodeModulesOfFolder(folder) {
            var root = path.join(folder, 'node_modules');
            var nodeModules = utils.getNodeModulesOfFolder(root);
            var i = 0;
            for (; !pathToModule && i < nodeModules.length; i += 1) {
                if (nodeModules[i] === module) {
                    pathToModule = path.join(root, module);
                } else {
                    checkNodeModulesOfFolder(path.join(root, nodeModules[i]));
                }
            }
        }

        try {
            pathToModule = require.resolve(module);
        } catch (e) {
            checkNodeModulesOfFolder(process.cwd());
        }
        return pathToModule;
    };

    return requireIt;
};

module.exports = RequireIt();