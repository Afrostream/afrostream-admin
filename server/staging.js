'use strict';

process.env.NODE_ENV = 'staging';
process.env.AFROSTREAM_API_KEY = process.env.AFROSTREAM_API_KEY || 'fe4be408-c93a-43dc-8f57-5dbd9060cac8';
process.env.AFROSTREAM_API_SECRET = process.env.AFROSTREAM_API_SECRET || '50cc564f-4803-4221-894b-714c4b272d57';
process.env.PORT = process.env.PORT || 9999,

require('./app');
