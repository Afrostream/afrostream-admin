'use strict';

module.exports = {
  // SELF
  env: 'production',
  ip: process.env.IP,
  port: process.env.PORT,
  portssl: process.env.PORTSSL,
  basicAuth: {
    user: 'afrostream',
    password: 'afrostream77'
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
    baseUrl: 'https://afrostream.tv'
  },

  "afrostream-back-end": {
    baseUrl: "https://afrostream-backend.herokuapp.com",

    sequelize: {
      uri: 'postgres://u9u17sot1un0hr:p6o70uurl15iblacuu0g042e742@ec2-54-217-234-109.eu-west-1.compute.amazonaws.com:5552/d8kcdisl77do4k',
      options: {
        logging: false,
        storage: 'afrostream.postgres',
        define: {
          timestamps: false
        }
      }
    },

    mq: {
      endPoint: 'amqp://bjkjcuac:AZXv0QBokSQpjM545tlFXTMER2QN9F9K@chicken.rmq.cloudamqp.com/bjkjcuac',
      exchangeName: 'afrostream-backend'
    }
  },

  algolia: {
    apiKey: '47d48040a13e973aca2ea9f492eca17e',
    appId: '3OKNPL7ZVA'
  },

  amazon: {
    key: 'AKIAIJ7BEEEIYX3CZDOQ',
    secret: '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',
    region: 'eu-west-1',
    baseUrl: 'https://s3-eu-west-1.amazonaws.com'
  },

  pf: {
    baseUrl: 'http://p-afsmsch-001.afrostream.tv:4000'
  },

  "proxy-out": {
    baseUrl: "http://p-afsmsch-001.afrostream.tv:4001"
  }
};
