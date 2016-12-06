'use strict';

module.exports = {
  // SELF
  env: 'staging',
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
      domain: 'afr-api-v1-staging.herokuapp.com'
    },
    netsize: {
      name: 'netsize',
      domain: '.afrostream.tv'
    }
  },

  // THIRD-PARTY
  "afrostream-front-end": {
    baseUrl: 'https://staging.afrostream.tv'
  },

  "afrostream-back-end": {
    baseUrl: "https://afr-back-end-staging.herokuapp.com",

    sequelize: {
      uri: 'postgres://u4fp4ad34q8qvi:pt7eht3e9v3lnehhh27m7sfeol@ec2-54-228-194-210.eu-west-1.compute.amazonaws.com:5522/d71on7act83b7i',
      options: {
        logging: console.log,
        storage: 'afrostream.postgres',
        define: {
          timestamps: false
        },
        // allowing to run staging conf on local dev env :)
        dialect: 'postgres',
        dialectOptions: {
          ssl: true
        }
      }
    },

    mq: {
      endPoint: 'amqp://yvkmghav:Uu-J25iHVqXV7C0_60e1V2JSgb0sEQ-3@chicken.rmq.cloudamqp.com/yvkmghav',
      exchangeName: 'afrostream-backend'
    }
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
    baseUrl: "FIXME: should be a mock http://p-afsmsch-001.afrostream.tv:4001"
  }
};
