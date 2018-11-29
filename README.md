# require-it

[![Build Status](https://travis-ci.org/szikszail/require-it.svg?branch=master)](https://travis-ci.org/szikszail/require-it) [![dependency Status](https://david-dm.org/szikszail/require-it.svg)](https://david-dm.org/szikszail/require-it) [![devDependency Status](https://david-dm.org/szikszail/require-it/dev-status.svg)](https://david-dm.org/szikszail/require-it#info=devDependencies)

This module extends the default nodejs require with capabilities to require nested modules, independent on where they are nested.

## Install

    npm install require-it --save

## Example

    myPackage
     + node_modules
     |  + direct-dependecy
     |  |  + node_modules
     |  |  |  \ nested-module
     |  |  |     + index.js
     |  |  |     \ package.json
     |  |  + index.js
     |  |  \ package.json
     |  + index.js
     |  \ package.json
     + index.js
     \ package.json

`myPackage/index.js`:

```javascript
var requireIt = require('require-it');
// it will work and won't throw error
var nestedModule = requireIt('nested-module');
```

## API

### `requireIt(moduleName)`

Requires the given local module, indenpendent on which level is it.

### `requireIt.resolve(moduleName)`

Returns the local path which could be required by `require`.

### `requireIt.directory(moduleName)`

Returns the local path wich could be required by `require` without the main JS file, ie. the path to the module's directory.

### `requireIt.global(globalModuleName)`

Requires the given global module.

### `requireIt.global.resolve(globalModuleName)`

Returns the global path which could be required by `require`.

### `requireIt.global.directory(globalModuleName)`

Returns the global path wich could be required by `require` without the main JS file, ie. the path to the module's directory.