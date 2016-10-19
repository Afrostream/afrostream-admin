'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('lifeSpot', {
        url: '/life/spots',
        templateUrl: 'app/data/data.html',
        controller: 'DataCtrl',
        type: 'life/spot',
        modalTemplateUrl: 'app/life/spots/spots.html',
        resolve: {
          countries: 'DataEmpty',
          genres: 'DataEmpty' // unused
        }
      });
  });
