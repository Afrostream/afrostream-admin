'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stores', {
        url: '/stores',
        templateUrl: 'app/stores/data.html',
        controller: 'DataCtrl',
        type: 'store',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
