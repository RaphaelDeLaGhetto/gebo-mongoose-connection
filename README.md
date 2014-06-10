gebo-mongoose-connection
========================

A ready-to-use mongoose connection for gebo

# Installation

```
npm install gebo-mongoose-connection
```

# Usage

`gebo-mongoose-connect` simply establishes a mongoose connection to the gebo database named in `gebo.json`.

```
var geboMongoose = require('gebo-mongoose-connection');

var mongoose = geboMongoose.get();
```

Use the `mongoose` object as per [the documentation](http://mongoosejs.com/docs/documents.html).

# License

MIT
