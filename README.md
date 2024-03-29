# require-it

![Downloads](https://img.shields.io/npm/dw/require-it?style=flat-square)
![Version@npm](https://img.shields.io/npm/v/require-it?label=version%40npm&style=flat-square)
![Version@git](https://img.shields.io/github/package-json/v/szikszail/require-it/master?label=version%40git&style=flat-square)

This module extends the default Node.js require with capabilities to require nested modules, independent of where they are nested.

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
const { requireIt } = require('require-it');
// it will work and won't throw error
const nestedModule = requireIt('nested-module');
```

## API

### `requireIt(moduleName)`

Requires the given local module, independent of which level it is.

#### `requireIt.resolve(moduleName)`

Returns the local path, which could be required by `require`.

#### `requireIt.directory(moduleName)`

Returns the local path, which could be required by `require` without the main JS file, i.e., the path to the module's directory.

### `requireGlobal(globalModuleName)`

Requires the given global module.

#### `requireGlobal.resolve(globalModuleName)`

Returns the global path, which could be required by `require`.

#### `requireGlobal.directory(globalModuleName)`

Returns the global path, which could be required by `require` without the main JS file, i.e., the path to the module's directory.

### `requireFrom(moduleName, root)`

Requires the given module found in the given root directory.

#### `requireFrom.resolve(moduleName, root)`

Returns the module's path, which could be required by `require`, found in the given root directory.

#### `requireFrom.directory(moduleName, root)`

Returns the module's path, which could be required by `require` without the main JS file, i.e., the path to the module's directory, found in the given root directory.
