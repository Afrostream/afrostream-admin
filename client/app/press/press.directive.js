'use strict';

angular.module('afrostreamAdminApp')
  .directive('press', function () {
    return {
      templateUrl: 'app/press/press.html',
      restrict: 'E',
      controller: 'PressCtrl'
    };
  });
