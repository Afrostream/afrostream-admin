'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('life', {
        url: '/life',
        templateUrl: 'app/life/life.html',
        controller: 'LifeCtrl',
        type: 'life'
      });
  });
