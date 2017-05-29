'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mailer', {
        url: '/mailer',
        templateUrl: 'app/mailer/mailer.html',
        controller: 'MailerCtrl',
        type: 'mailer'
      });
  });
