'use strict';

angular.module('afrostreamAdminApp')
  .controller('StoreDialogCtrl', function ($scope, $q, $sce, $log, $http, $cookies, $uibModalInstance, item, list, type, Image, ngToast, FileUploader) {

    $scope.item = item;
    $scope.isImporting = false;
    $scope.storeList = null;
    $scope.imported = 0;
    $scope.importProgress = 0;
    $scope.item.type = $scope.item.type || type;
    $scope.directiveType = type + 's';
    $scope.list = list || [];

    $scope.$watch('imported', function () {
      if (!$scope.storeList) {
        return;
      }
      $scope.importProgress = Math.round(($scope.imported * 100) / $scope.storeList.length);
      $log.debug('imported', $scope.importProgress)
    });

    function importChunk (data) {
      $http.post('/api/stores/import', {
        storeList: data,
        location: '{Adresse2},{CP},{Ville}'
      }).then(function (result) {
        $scope.imported += result.data.length;
      }, function (err) {
        $log.debug(err);
      });
    }

    $scope.importAll = function () {
      $scope.isImporting = true;
      $scope.importProgress = 0;
      var defer = $q.defer();
      var promises = [];

      var splitedValues = _.chunk($scope.storeList, 10);

      _.forEach(splitedValues, function (splitedValues) {
        $log.debug('splitedValues', splitedValues);
        promises.push(importChunk(splitedValues));
      });

      $q.all(promises).then(function () {
        $scope.isImporting = false;
        defer.resolve();
      });

      return defer.promise;
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };

    var showError = function () {
      ngToast.create({
        className: 'warning',
        content: 'Erreur lors de l\'ajout a aws '
      });
    };

  });
