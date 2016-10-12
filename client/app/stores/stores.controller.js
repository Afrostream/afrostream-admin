'use strict';

angular.module('afrostreamAdminApp')
  .controller('StoresCtrl', function ($scope, $http, $uibModal, ngToast) {

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

    $scope.importStore = function (item) {
      if (typeof $scope.modalHooks.beforeUpdate === 'function') {
        $scope.modalHooks.beforeUpdate();
      }
      $http.post('/api/stores/import', {
        storeList: [item],
        location: '{adresse},{cp},{ville}'
      }).then(function (result) {
        $scope.item = result.data[0];
        ngToast.create({
          content: 'L\'objet  ' + $scope.type + ' ' + ' à été mise a jour'
        });
        if (typeof $scope.modalHooks.afterUpdate === 'function') {
          $scope.modalHooks.afterUpdate(result.data[0]);
        }
      }, function (err) {
        $log.debug(err);
      });
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
