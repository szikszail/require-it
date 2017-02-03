'use strict';

const fs = require('fs');
const path = require('path');

const self = {
    isFile(file) {
        try {
            return fs.statSync(file).isFile();
        } catch (e) {
            return false;
        }
    },
    isFolder(folder) {
        try {
            return fs.statSync(folder).isDirectory();
        } catch (e) {
            return false;
        }
    },
    isNodeModule(folder) {
        return this.isFolder(folder)
            && [this.isFolder(path.join(folder, 'node_modules'))
            || this.isFile(path.join(folder, 'package.json'))];
    },
    getNodeModulesOfFolder(folder) {
        try {
            return fs.readdirSync(folder).filter(file => {
                return this.isNodeModule(path.join(folder, file));
            });
        } catch (e) {
            return [];
        }
    },
    getFolder(folder) {
        return folder.split(/[\/\\]/).pop();
    }
};
module.exports = self;