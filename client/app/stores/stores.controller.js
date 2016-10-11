'use strict';

angular.module('afrostreamAdminApp')
  .controller('StoresCtrl', function ($scope, $uibModal) {

    $scope.importCSV = function () {
      var modalNewOpts = {
        templateUrl: 'app/stores/modal/store.html', // Url du template HTML
        controller: 'StoreDialogCtrl',
        size: 'lg',
        scope: $scope,
        resolve: {
          item: function () {
            return $scope.currentItem;
          },
          list: function () {
            return [];
          },
          type: function () {
            return $scope.type;
          }
        }
      };
      var $uibModalInstance = $uibModal.open(modalNewOpts);
    };

    $scope.$watch('item.geometry.coordinates', function (json) {
      $scope.jsonString = json && json.join(',');
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
