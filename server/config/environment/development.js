'use strict';
var path = require('path');

module.exports = {
  // Root path of server
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 3002,
  backendApiKey: '488d2f13-6c01-464f-bfa4-bf8c641d7063',
  backendApiSecret: '17abaee4-032d-4703-be86-0af3523dcedd'
};
