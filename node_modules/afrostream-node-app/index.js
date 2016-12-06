'use strict';

// 3rd party lib
var express = require('express');
var ejs = require('ejs');

// 3rd party middleware
var middlewareMethodOverride = require('method-override');
var middlewareCompression = require('compression');

// afrostream middlewares
var middlewareMorgan = require('afrostream-node-middleware-morgan');
var middlewareBodyParser = require('body-parser');
var middlewareBasicAuth = require('basic-auth-connect');
var middlewareCacheHandler = require('afrostream-node-middleware-cachehandler');
var middlewareAllowPreflight = require('afrostream-node-middleware-allowpreflight');
var middlewareAllowCrossdomain = require('afrostream-node-middleware-allowcrossdomain');
var middlewareUserIp = require('afrostream-node-middleware-userip');

var alive = require('./controller.alive.js');

module.exports.create = function (options) {
  options = options || {};

  var app = express();
  app.set('startDate', new Date());
  app.set('x-powered-by', false);
  app.set('etag', false);
  if (options.views) {
    app.set('view engine', 'ejs');
    app.set('views', options.views);
    app.engine('html', ejs.renderFile);
  }

  //
  app.use(middlewareCompression());
  app.use(middlewareUserIp());
  app.use(middlewareMorgan('afro'));
  app.use(middlewareMethodOverride());

  // middlewares for cache & cross domain
  app.use(middlewareCacheHandler());
  app.use(middlewareAllowCrossdomain());
  app.use(middlewareAllowPreflight());

  // alive is the only route unprotected by basicAuth
  app.get('/alive', alive);

  // authentication
  if (options.basicAuth) {
    app.use(middlewareBasicAuth(options.basicAuth.user, options.basicAuth.password));
  }

  // body parsing
  app.use(middlewareBodyParser.text({type: 'text/xml'}));
  app.use(middlewareBodyParser.urlencoded({extended: false, limit:'500kb'}));
  app.use(middlewareBodyParser.json({limit:'500kb'}));

  return app;
};