'use strict';
var express = require('express');
var path = require('path');
var config = require('../config');

var middlewareAuth = require('./middlewares/middleware-auth.js');
var middlewareDumpPostdata = require('./middlewares/middleware-dumppostdata.js');
var middlewareRedirect = require('./middlewares/middleware-redirect.js');

// pre-configured express app
var AfrostreamNodeApp = require('afrostream-node-app');
var app = AfrostreamNodeApp.create();
app.use(middlewareRedirect.forceSSL());
app.use(middlewareDumpPostdata());
app.use(middlewareAuth());

switch (process.env.NODE_ENV) {
  case 'production':
  case 'staging':
    app.set('appPath', path.join(global.__basedir, 'client'));
    app.use(express.static(app.get('appPath')));
    break;
  default:
    var middlewareErrorHandler = require('errorhandler');

    app.use(middlewareErrorHandler());
    app.set('appPath', path.join(global.__basedir, 'client'));
    app.use(express.static(path.join(global.__basedir, '.tmp')));
    app.use(express.static(app.get('appPath')));
    break;
}

var routes = require('./routes.js');
app.use(routes);

module.exports = app;
