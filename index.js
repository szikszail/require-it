'use strict';

const path = require('path');
const fs = require('fs');

const utils = require('./utils');

const requireIt = function (module) {
    return require(requireIt.resolve(module));
};

requireIt.resolve = module => {
    let pathToModule;

    const checkNodeModulesOfFolder = folder => {
        const root = path.join(folder, 'node_modules');
        const nodeModules = utils.getNodeModulesOfFolder(root);
        for (let i = 0; !pathToModule && i < nodeModules.length; i += 1) {
            if (utils.getFolder(nodeModules[i]) === module) {
                pathToModule = path.join(root, nodeModules[i]);
            } else {
                utils.getNodeModulesOfFolder(path.join(root, nodeModules[i], 'node_modules')).forEach(subModule => {
                    nodeModules.push(path.join(nodeModules[i], 'node_modules', subModule));
                });
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

requireIt.directory = module => {
    let pathToModule = requireIt.resolve(module);
    if (!pathToModule) {
        throw Error(`Cannot find module: '${module}'`);
    }
    return path.join(pathToModule.split(module).slice(0, -1).join(module), module);
};

module.exports = requireIt;