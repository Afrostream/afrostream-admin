'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carousel', {
        url: '/carousel',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'carousel',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty'
        }
      });
  });
