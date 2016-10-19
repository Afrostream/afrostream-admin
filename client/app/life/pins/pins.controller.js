'use strict';

angular.module('afrostreamAdminApp')
  .controller('LifePinCtrl', function ($scope, LifeTheme) {

    $scope.loadLifeTheme = function (query) {
      return LifeTheme.query({query: query}).$promise;
    };
  });
