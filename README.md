# debug-ext
## An extension to [debug](https://www.npmjs.com/package/debug) module

_At this point just Node.js environment is supported._

Updates [debug](https://www.npmjs.com/package/debug) utility with following functionalities:

* Removes [obligatory milliseconds diff](https://github.com/visionmedia/debug/issues/187) information
* Assures that one namespace in all cases is output with same color
* Provides simple progress bar functionality for long-taking tasks:

```javascript
var debug = require('debug-ext')('ns');
debug.open("Parse data");
..
debug.progress(); // increment progress
...
debug.close(); // Mark task as done
```

## [![Build Status](https://travis-ci.org/medikoo/debug-ext.svg)](https://travis-ci.org/medikoo/debug-ext)
