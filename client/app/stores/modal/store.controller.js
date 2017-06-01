'use strict';

angular.module('afrostreamAdminApp')
  .controller('StoreDialogCtrl', function ($scope, $q, $sce, $log, $http, $cookies, $uibModalInstance, item, list, type, Image, ngToast, FileUploader) {

    $scope.item = item;
    $scope.isImporting = false;
    $scope.storeList = null;
    $scope.imported = null;
    $scope.importedError = null;
    $scope.importProgress = 0;
    $scope.importStatus = 'info';
    $scope.item.type = $scope.item.type || type;
    $scope.directiveType = type + 's';
    $scope.list = list || [];

    $scope.$watch('imported', function () {
      if (!$scope.storeList) {
        return;
      }
      $scope.importProgress = Math.round(($scope.imported.length * 100) / $scope.storeList.length);
      $scope.importStatus = $scope.imported.length == $scope.storeList.length ? 'success' : 'warning';
      $log.debug('imported', $scope.importProgress)
    });

    function importChunk (data) {
      $http.post('/api/stores/import', {
        storeList: data,
        location: '{adresse},{cp},{Ville}'
      }).then(function (result) {
        $scope.imported = _.concat($scope.imported || [], result.data);

        $scope.importedError = _.concat($scope.importedError, _.differenceBy(data, result.data, 'mid'));
        $scope.importedError = _.map($scope.importedError, function (errorImport) {
          return _.pick(errorImport, ['mid', 'cp', 'name', 'phone', 'adresse', 'ville'])
        });
        $log.warn($scope.importedError);
      }, function (err) {
        $log.debug(err);
      });
    }

    function zeroPad (num, size) {
      var s = String(num);
      while (s.length < (size || 2)) {
        s = '0' + s;
      }
      return s;
    }

    $scope.importAll = function () {
      $scope.isImporting = true;
      $scope.importProgress = 0;
      $scope.imported = [];
      $scope.importedError = [];
      var defer = $q.defer();
      defer.promise.then(function () {
        $scope.isImporting = false;
        $scope.importStatus = $scope.imported.length == $scope.storeList.length ? 'success' : 'danger';
      }).catch(function (err) {
        $scope.isImporting = false;
        $scope.importStatus = $scope.imported.length == $scope.storeList.length ? 'success' : 'danger';
      });

      var promises = [];

      $scope.storeList = _.forEach($scope.storeList, function (store) {
        store.cp = zeroPad(store.cp || store.CP, 5);
        store.mid = store.mid || store.MID;
        store.name = store.name || store.Nom;
        store.adresse = store.adresse || store.Adresse1 + ' ' + store.Adresse2;
        store.ville = store.ville || store.Ville;
        store.phone = store.phone || store.Telephone;

        store = _.forEach(store, function (value, key) {
          var newValue = value.replace(/[^a-zA-Z0-9]/g, ' ');
          newValue = newValue.replace(/\s\s+/g, ' ');
          store[key] = newValue;
          return store;
        })
      });

      var splitedValues = _.chunk($scope.storeList, 10);

      $scope.promisify = function (prev, cur) {
        return $q.when(prev, function () {
          return importChunk(cur);
        });
      };

      /* replace $scope.promisify with $q.when
       if you don't need to do anything after each one or
       your promise returns another promise
       */
      splitedValues.reduce($scope.promisify, promises[0]).then(function () {
        $log.debug($scope.imported.length, $scope.storeList.length);
        defer.resolve();
      });

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
