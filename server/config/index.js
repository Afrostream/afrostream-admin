'use strict';

var config = require('afrostream-node-config');

config.merge('development', require('./environment/development.js'));
config.merge('test', require('./environment/test.js'));
config.merge('staging', require('./environment/staging.js'));
config.merge('production', require('./environment/production.js'));

module.exports = config.get();