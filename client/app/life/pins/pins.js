'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pins', {
        url: '/life/pins',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'life/pin',
        modalTemplateUrl: 'app/life/pins/pins.html',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
