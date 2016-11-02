'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('press', {
        url: '/press',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'press',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
