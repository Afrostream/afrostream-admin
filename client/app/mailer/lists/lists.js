'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mailerList', {
        url: '/mailer/lists',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'mailer/list',
        modalTemplateUrl: 'app/mailer/lists/modal.html',
        modalCtrl: 'MailerListModalCtrl',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
