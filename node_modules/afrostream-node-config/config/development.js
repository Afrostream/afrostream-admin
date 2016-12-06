'use strict';

module.exports = {
  // SELF / SHARED
  env: 'development',
  ip: process.env.IP,
  port: process.env.PORT,
  portssl: process.env.PORTSSL,

  basicAuth: {
    user: process.env.BASIC_AUTH_USER || 'dev',
    password: process.env.BASIC_AUTH_PASSWORD || 'dev'
  },

  cookies: {
    secret: '2342REJIEJIZJO29J9JGZF',
    test: {
      name: 'test',
      domain: '.afrostream.tv'
    },
    netsize: {
      name: 'netsize',
      domain: '.afrostream.tv'
    }
  },

  // THIRD-PARTY
  "afrostream-front-end": {
    baseUrl: process.env.AFROSTREAM_FRONT_END_BASEURL || 'http://localhost:5600'
  },

  "afrostream-back-end": {
    baseUrl: process.env.AFROSTREAM_BACK_END_BASEURL || "http://localhost:5602",

    sequelize: {
      uri: process.env.AFROSTREAM_BACK_END_DATABASE_URL || 'postgres://postgres:postgres@localhost:5700/afrostream',
      options: {
        logging: console.log,
        storage: 'dev.postgres',
        define: {
          timestamps: false
        }
      }
    },

    mq: {
      endPoint: process.env.AFROSTREAM_BACK_END_AMQP_URL || 'amqp://localhost:5603',
      exchangeName: 'afrostream-backend',
      autoReconnect: true,
      displayErrors: true
    }
  },

  amazon: {
    key: process.env.AWS_S3_KEY || 'AKIAIJ7BEEEIYX3CZDOQ',
    secret: process.env.AWS_S3_SECRET || '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',
    region: process.env.AWS_S3_REGION || 'eu-west-1',
    baseUrl: process.env.AWS_S3_BASE_URL || 'https://s3-eu-west-1.amazonaws.com'
  },

  pf: {
    baseUrl: process.env.AFROSTREAM_PF_BASE_URL || 'http://p-afsmsch-001.afrostream.dev'
  },

  "proxy-out": {
    baseUrl: "FIXME: should be a mock http://p-afsmsch-001.afrostream.tv:4001"
  }
};
