'use strict';

var path = require('path');

module.exports = {
  port: process.env.PORT || 9999,
  backendApiKey: process.env.AFROSTREAM_API_KEY || '488d2f13-6c01-464f-bfa4-bf8c641d7063',
  backendApiSecret: process.env.AFROSTREAM_API_SECRET || '17abaee4-032d-4703-be86-0af3523dcedd'
};
