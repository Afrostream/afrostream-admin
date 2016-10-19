'use strict';

angular.module('afrostreamAdminApp')
  .directive('pins', function () {
    return {
      templateUrl: 'app/life/spots/spots.html',
      restrict: 'E',
      controller: 'LifeSpotCtrl'
    };
  });
