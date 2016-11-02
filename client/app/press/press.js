'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('press', {
        url: '/press',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'pres',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
