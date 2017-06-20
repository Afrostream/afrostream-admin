'use strict';

angular.module('afrostreamAdminApp')
  .controller('MailerProviderModalCtrl', function ($scope, $http, item, type, ngToast, $timeout, $interval, $uibModalInstance, ModalUtils, $rootScope, $uibModal) {
    // modal generic
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
      $scope.getItem()
    }, 100);

  });
