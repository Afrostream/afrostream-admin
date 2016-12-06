# Description

shared configuration repository

# Warning

unsecured

# Usage

read

```js
var config = require('afrostream-node-config');
config.get('ip');
config.get('port');
config.get(); // <= full object.
```

write

```js
var config = require('afrostream-node-config');
config.set('staging', 'port', 4242);

// (...)
process.env.NODE_ENV = 'staging';
config.get('port'); // 4242
```
