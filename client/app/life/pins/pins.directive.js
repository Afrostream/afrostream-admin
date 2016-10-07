'use strict';

angular.module('afrostreamAdminApp')
  .directive('pins', function () {
    return {
      templateUrl: 'app/life/pins/pins.html',
      restrict: 'E',
      controller: 'PinsCtrl'
    };
  });
