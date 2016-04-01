var fs = require('fs');
var path = require('path');

var self = {
    isFile: function isFile(file) {
        try {
            return fs.statSync(file).isFile();
        } catch (e) {
            return false;
        }
    },
    isFolder: function isFolder(folder) {
        try {
            return fs.statSync(folder).isDirectory();
        } catch (e) {
            return false;
        }
    },
    isNodeModule: function isNodeModule(folder) {
        return self.isFolder(folder)
            && [self.isFolder(path.join(folder, 'node_modules'))
            || self.isFile(path.join(folder, 'package.json'))];
    },
    getNodeModulesOfFolder: function getNodeModulesOfFolder(folder) {
        try {
            return fs.readdirSync(folder).filter(function (file) {
                return self.isNodeModule(path.join(folder, file));
            });
        } catch (e) {
            return [];
        }
    }
};
module.exports = self;