'use strict';

angular.module('afrostreamAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pf', {
        url: '/pf',
        templateUrl: 'app/pf/pf.html',
        controller: 'PfCtrl',
        type: 'pf'
      });
  });
