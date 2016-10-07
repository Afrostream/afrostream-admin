'use strict';

angular.module('afrostreamAdminApp')
  .directive('life', function () {
    return {
      templateUrl: 'app/life/life.html',
      restrict: 'E',
      controller: 'LifeCtrl'
    };
  });
