'use strict';

var config = require('../config');

var Client = require('afrostream-node-client-backend');

var client = new Client({
  apiKey: config.backendApiKey,
  apiSecret: config.backendApiSecret
});

module.exports = client;
