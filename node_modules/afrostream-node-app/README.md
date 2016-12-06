# Description

express pre-configured app    

Features :  
* middleware preflight
* middleware cross domain
* middleware body parser for content type json, xml, form url encoded, up to 500kb POST requests
* /alive
* ejs views, using .html extension
* no etag
* no express custom headers 

# Usage

to create a simple server

```js
var app = require('afrostream-node-app').create();
app.use(function (req) { req.send('youpi'); }
app.listen(8080);
```

# API

## create(options)

@param options object  
@param  
@return app    object   epxress js app object  

```js
var app = require('afrostream-node-app').create();
app.use(function (req) { req.send('youpi'); }
```
