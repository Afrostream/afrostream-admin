'use strict';

angular.module('afrostreamAdminApp')
  .directive('stores', function () {
    return {
      templateUrl: 'app/stores/stores.html',
      restrict: 'E',
      controller: 'StoresCtrl'
    };
  });
