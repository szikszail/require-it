'use strict';

const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const {execSync} = require('child_process');

const _resolve = (isGlobal, module) => {
    let pathToModule;
    let packageRoot = process.cwd();
    if (isGlobal) {
        packageRoot = execSync('npm root -g', {encoding: 'utf8'}).trim().replace(/node_modules$/, '');
    }

    const checkScopedNodeModulesOfFolder = (folder, module) => {
        const directModules = utils.getNodeModulesOfFolder(folder);
        let found = false;
        for (let i = 0; i < directModules.length; ++i) {
            if (utils.getFolder(directModules[i]) === module) {
                pathToModule = path.join(folder, directModules[i]);
                found = true;
                break;
            }
        }
        if (!found) {
            throw Error(`Cannot find module: '${module}'`);
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

    const determineFolder = module => {
        let names = module.match(/^(@[^/]+)\/(.+)$/);
        if (names) {
            checkNodeModulesOfFolder(packageRoot, names[1]);
            checkScopedNodeModulesOfFolder(pathToModule, names[2]);
        } else {
            checkNodeModulesOfFolder(packageRoot, module);
        }
    }

    if (isGlobal) {
        determineFolder(module);
    } else {
        try {
            pathToModule = require.resolve(module);
        } catch (e) {
            determineFolder(module);
        }
    }
    return pathToModule;
}

const _directory = (isGlobal, module) => {
    let pathToModule = _resolve(isGlobal, module);
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
}

const requireIt = module => require(requireIt.resolve(module));
requireIt.resolve = _resolve.bind(null, false);
requireIt.directory = _directory.bind(null, false);

const globalRequireIt = module => require(globalRequireIt.resolve(module));
globalRequireIt.resolve = _resolve.bind(null, true);
globalRequireIt.directory = _directory.bind(null, true);

requireIt.global = globalRequireIt;

module.exports = requireIt;