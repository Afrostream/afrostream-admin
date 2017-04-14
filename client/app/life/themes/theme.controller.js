'use strict';

angular.module('afrostreamAdminApp')
  .controller('LifeThemeCtrl', function ($scope, LifePin) {

    $scope.loadLifePin = function (query) {
      return LifePin.query({query: query}).$promise;
    };
  });
