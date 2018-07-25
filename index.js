'use strict';

const path = require('path');
const fs = require('fs');

const utils = require('./utils');

const requireIt = function (module) {
    return require(requireIt.resolve(module));
};

requireIt.resolve = module => {
    let pathToModule;

    const checkScopedNodeModulesOfFolder = (folder, module) => {
        const directModules = utils.getNodeModulesOfFolder(folder);
        for (let i = 0; i < directModules.length; ++i) {
            if (utils.getFolder(directModules[i]) === module) {
                pathToModule = path.join(folder, directModules[i]);
                break;
            }
        }
    }
    const checkNodeModulesOfFolder = (folder, module) => {
        const root = path.join(folder, 'node_modules');
        const nodeModules = utils.getNodeModulesOfFolder(root);
        for (let i = 0; !pathToModule && i < nodeModules.length; ++i) {
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
        let names = module.match(/^(@[^/]+)\/(.+)$/);
        if (names) {
            checkNodeModulesOfFolder(process.cwd(), names[1]);
            checkScopedNodeModulesOfFolder(pathToModule, names[2]);
        } else {
            checkNodeModulesOfFolder(process.cwd(), module);
        }
    }
    return pathToModule;
};

requireIt.directory = module => {
    let pathToModule = requireIt.resolve(module);
    if (!pathToModule) {
        throw Error(`Cannot find module: '${module}'`);
    }
    module = module.replace('/', path.sep);
    const pathPieces = pathToModule.split(module)
        .filter(p => !/^[/\\]$/.test(p))
        .filter(p => !/\.[^\.\\/]+$/.test(p));
    if (pathPieces.length > 1) {
        return pathPieces.join(module);
    }
    return path.join(pathPieces[0], module);
};

module.exports = requireIt;