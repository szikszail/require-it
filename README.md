# require-it

This module extends the default nodejs require with capabilities to require nested modules, independent on where they are nested.

**This module is for npm < 3.0, because new npm versions flatten the dependency tree and the problem is solved :)**

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