'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Export the application
var app = require('./app');

// global
global.__basedir = __dirname + '/../..';
global.rootRequire = function (name) {
  return require(global.__basedir + '/' + (name[0] === '/' ? name.substr(1) : name));
};


app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

module.exports = app;
