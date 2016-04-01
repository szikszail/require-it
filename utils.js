var fs = require('fs');
var path = require('path');

var self = {
    isFile: function isFile(file) {
        console.log('isFile', file);
        try {
            return fs.statSync(file).isFile();
        } catch (e) {
            return false;
        }
    },
    isFolder: function isFolder(folder) {
        console.log('isFolder', folder);
        try {
            return fs.statSync(folder).isDirectory();
        } catch (e) {
            return false;
        }
    },
    isNodeModule: function isNodeModule(folder) {
        console.log('isNodeModule', folder);
        return self.isFolder(folder)
            && [self.isFolder(path.join(folder, 'node_modules'))
                || self.isFile(path.join(folder, 'package.json'))];
    }
};
module.exports = self;