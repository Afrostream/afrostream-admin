'use strict';

angular.module('afrostreamAdminApp')
  .controller('StoresCtrl', function ($scope) {

    $scope.$watch('item.geometry.coordinates', function (json) {
      $scope.jsonString = json.join(',');
    }, true);

    $scope.$watch('jsonString', function (json) {
      try {
        var strArray = json.split(',');
        var intArray = [];
        for (var i = 0; i < strArray.length; i++) {
          intArray[i] = parseFloat(strArray[i]);
        }
        $scope.item.geometry.coordinates = intArray;
        $scope.wellFormed = true;
      } catch (e) {
        $scope.wellFormed = false;
      }
    }, true);

  });
