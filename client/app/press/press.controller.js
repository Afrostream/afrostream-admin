'use strict';

angular.module('afrostreamAdminApp')
  .controller('PressCtrl', function ($scope, Press) {
    $scope.loadPress = function (query) {
      var p = Press.query({query: query}).$promise;
      p.then(function (response) {
        return response;
      });
      return p;
    };
  });
