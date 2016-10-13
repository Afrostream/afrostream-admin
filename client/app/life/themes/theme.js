'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('lifeTheme', {
        url: '/life/themes',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'life/theme',
        modalTemplateUrl: 'app/life/themes/theme.html',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
