'use strict';

angular.module('afrostreamAdminApp')
  .controller('MailerListModalCtrl', function ($scope, $http, item, type, ngToast, $timeout, $uibModalInstance, ModalUtils) {
    $scope.modalType = type;
    $scope.modalHooks = {};

    $scope.cancel = function () {
      close(true);
    };

    var close = function (cancel) {
      $uibModalInstance.close();
      if (typeof $uibModalInstance.onClose === 'function') {
        $uibModalInstance.onClose(cancel);
      }
    };

    $scope.addItem = ModalUtils.createHandlerAddItem({
      $scope: $scope,
      close: close
    });
    $scope.updateItem = ModalUtils.createHandlerUpdateItem({
      $scope: $scope,
      close: close
    });
    $scope.deleteItem = ModalUtils.createHandlerDeleteItem({
      $scope: $scope,
      close: close
    });

    $scope.getItem = ModalUtils.createHandlerGetItem($scope, item);

    // getItem is often triggered before modal hooks are binded (directives aren't yet loaded)
    //  so this timeout is a quick fix & not the proper way of mitigating the pb
    $timeout(function () {
      $scope.getItem();
    }, 100);


    /////////////////////////// specific code ///////////////
    $scope.loading = true;

    $http.get('/api/mailer/providers')
      .then(function (result) {
        $scope.providers = result.data;
      });
  });
