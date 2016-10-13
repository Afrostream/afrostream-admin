'use strict';

angular.module('afrostreamAdminApp')
  .controller('PinsCtrl', function ($scope, LifeTheme) {

    $scope.loadLifeTheme = function (query) {
      return LifeTheme.query({query: query}).$promise;
    };
  });
