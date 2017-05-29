'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var errors = require('./../components/errors/index');
var backend = require('./backend.js');

var backendProxy = function (options) {
  return function (req, res) {
    backend.proxy(req, res, {
      token: req.userAccessToken,
      timeout: options && options.timeout || null,
      forwardedHeaders: {
        Range: 'Range'
      }
    }, {
      hookBeforeSendSync: function (res) {
        // enforce no cache
        res.noCache();
      }
    });
  };
};

var noCache = function (req, res, next) {
  res.noCache();
  next();
};
// API

// all user routes require the afro token.
var userTokenRequired = function (req, res, next) {
  if (!req.userAccessToken) {
    console.error('Unauthorized: missing Access-Token on ' + req.url);
    res.status(401).send('Unauthorized');
    return;
  }
  next();
};


var i = 0;
router.get('/test/highwinds', function (req, res) {
  res.noCache();
  res.json({
    nbHits: ++i,
    now: Date.now()
  });
});

router.use('/api/*', userTokenRequired, backendProxy());
/*
 * AUTH
 */
var authController = require('./auth/auth.controller.js');

router.post('/auth/refresh', noCache, authController.refresh);
router.post('/auth/signup', noCache, authController.signup);
router.post('/auth/signin', noCache, authController.signin);
router.post('/auth/reset', noCache, authController.reset);

// Admin whitelist routes.
router.route(/^\/(categorys|licensors|movies|seasons|episodes|videos|languages|images|users|subscriptions|clients|actors|settings|login|life|logout|jobs|posts|catchup|users\-logs|imports|configs|widgets|works|press|stores|carousel|notifications|mailer)/)
  .get(function (req, res) {
    res.set('Cache-Control', 'public, max-age=0');
    res.sendFile(path.resolve(req.app.get('appPath') + '/index.html'));
  });

// undefined routes should return a 404
router.route('.*').get(errors[404]);


module.exports = router;
