# Description

this middleware will add these headers to every requets :
    res.header('Access-Control-Allow-Origin', url);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Access-Token, Authorization, x-http-method-override');

# Warning

unsecured

# Usage

```js
app.use(require('afrostream-node-middleware-allowcrossdomain')());
```