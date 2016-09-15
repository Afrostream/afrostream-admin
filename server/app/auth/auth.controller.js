'use strict';

var backend = require('../backend');

var config = require('../../config');

var _signin = function (req) {
  return backend.post({
    uri: '/auth/oauth2/token',
    body: {
      grant_type: 'password',
      username: req.body.email,
      password: req.body.password,
      client_id: config.backendApiKey,
      client_secret: config.backendApiSecret
    },
    req: req
  });
};

var _refresh = function (req) {
  return backend.post({
    uri: '/auth/oauth2/token',
    body: {
      grant_type: 'refresh_token',
      refresh_token: req.body.refresh_token,
      client_id: config.backendApiKey,
      client_secret: config.backendApiSecret
    },
    req: req
  });
};

var signup = function (req, res) {
  // maybe it's a signin ?
  _signin(req)
    .then(
      function (oauth2Response) {
        if (!oauth2Response.access_token) {
          throw new Error("no access_token");
        }
        return oauth2Response;
      })
    .then(
      function (oauth2Response) {
        console.log('auth: signup: -> signin: ' + req.body.email);
        res.json({
          accessToken: oauth2Response.access_token, // deprecated
          access_token: oauth2Response.access_token,
          refreshToken: oauth2Response.refresh_token, // deprecated
          refresh_token: oauth2Response.refresh_token,
          expiresIn: oauth2Response.expires_in, // deprecated
          expires_in: oauth2Response.expires_in
        });
      },
      function (err) {
        // ok, let's signup
        backend.post({
          uri: '/api/users',
          body: req.body,
          req: req
        })
          .then(
            function success () {
              console.error('auth: signup: ok: ' + req.body.email + ' created');
              return signin(req, res);
            },
            function error (err) {
              console.error('auth: signup: error: ' + req.body.email + ' ' + err.message, err);
              res.status(err.statusCode || 500).json({error: err.message, message: err.message});
            });
      });
};

var signin = function (req, res) {
  _signin(req)
    .then(
      function success (oauth2Response) {
        console.log('auth: signin: ok: ' + req.body.email);
        res.json({
          accessToken: oauth2Response.access_token, // deprecated
          access_token: oauth2Response.access_token,
          refreshToken: oauth2Response.refresh_token, // deprecated
          refresh_token: oauth2Response.refresh_token,
          expiresIn: oauth2Response.expires_in, // deprecated
          expires_in: oauth2Response.expires_in
        });
      },
      function error (err) {
        /*
         // FIXME: cookie auth.
         res.clearCookie('auth');
         */
        console.error('auth: signin: error: ' + req.body.email + ' ' + err.message, err);
        res.status(err.statusCode || 500).json({error: err.message, message: err.message});
      });
};

var refresh = function (req, res) {
  _refresh(req)
    .then(
      function success (oauth2Response) {
        console.log('auth: signin: ok: ' + req.body.email);
        res.json({
          accessToken: oauth2Response.access_token, // deprecated
          access_token: oauth2Response.access_token,
          refreshToken: oauth2Response.refresh_token, // deprecated
          refresh_token: oauth2Response.refresh_token,
          expiresIn: oauth2Response.expires_in, // deprecated
          expires_in: oauth2Response.expires_in
        });
      },
      function error (err) {
        /*
         // FIXME: cookie auth.
         res.clearCookie('auth');
         */
        console.error('auth: refresh token : error: ' + req.body.email + ' ' + err.message, err);
        res.status(err.statusCode || 500).json({error: err.message, message: err.message});
      });
};

var reset = function (req, res) {
  return backend.post({
    uri: '/auth/reset',
    body: req.body,
    req: req
  })
    .then(
      function success (data) {
        if (req.body.email) {
          console.error('auth: reset: ok: email ' + req.body.email);
        } else if (req.body.k) {
          console.error('auth: reset: ok: token ' + req.body.k);
        }
        res.status(200).json(data);
      },
      function error (err) {
        console.error('auth: reset: error: ' + err.message, err);
        res.status(err.statusCode || 500).json({error: err.message, message: err.message});
      });
};


module.exports.refresh = refresh;
module.exports.signin = signin;
module.exports.signup = signup;
module.exports.reset = reset;
