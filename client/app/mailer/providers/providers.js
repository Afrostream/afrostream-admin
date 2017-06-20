angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mailerProvider', {
        url: '/mailer/providers',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'mailer/provider',
        modalTemplateUrl: 'app/mailer/providers/modal/template.html',
        modalCtrl: 'MailerProviderModalCtrl',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
