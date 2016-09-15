'use strict';
var express = require('express');
var path = require('path');
var config = require('../config');

var middlewareAuth = require('./middlewares/middleware-auth.js');

// pre-configured express app
var AfrostreamNodeApp = require('afrostream-node-app');
var app = AfrostreamNodeApp.create();
app.use(middlewareAuth());

switch (process.env.NODE_ENV) {
  case 'production':
  case 'staging':
    app.set('appPath', path.join(config.root, 'dist', 'client'));
    app.set('docPath', path.join(config.root, 'dist', 'apidoc'));
    app.use(favicon(path.join(config.root, 'dist', 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath')));
    break;
  default:
    var middlewareLiveReload = require('connect-livereload');
    var middlewareErrorHandler = require('errorhandler');

    app.use(middlewareLiveReload());
    app.use(middlewareErrorHandler());
    app.set('appPath', path.join(config.root, 'client'));
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    break;
}

var routes = require('./routes.js');
app.use(routes);

module.exports = app;
