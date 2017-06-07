'use strict';

angular.module('afrostreamAdminApp')
  .controller('MailerListModalCtrl', function ($scope, $http, item, type, ngToast, $timeout, $uibModalInstance, ModalUtils) {
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
        .then(function () {
          updateAssoProviders();
        });
    }, 100);


    /////////////////////////// specific code ///////////////
    $scope.loading = true;
    $scope.assoProviders = [ ];
    $scope.error = '';

    $http.get('/api/mailer/providers', { params: { canHandleList: "true" } } )
      .then(function (result) {
        $scope.providers = result.data;
        $scope.loading = false;
        updateAssoProviders();
      }, function (err) {
        $scope.error = err.message;
      });

    function updateAssoProviders() {
      if ($scope.item && $scope.providers) {
        $scope.assoProviders = $scope.providers.map(
          function (provider) {
            var asso = $scope.item.assoProviders.filter(
              function (asso) {
                return asso && asso.providerId == provider._id;
              }
            ).pop();
            var linked = asso ? true : false;

            var link = null;
            if (provider.interface === 'Mailblast' && asso) {
              link = 'https://mailblast.io/lists/'+asso.pApiId+'/subscribers';
            }
            return {
              provider: {
                _id: provider._id,
                name: provider.name
              },
              info: {
                link: link
              },
              linked: linked
            };
          }
        )
      }
    }

    $scope.link = function (provider) {
      $scope.error = '';
      $scope.loading = true;

      $http({
        method: 'POST',
        url: '/api/mailer/lists/'+$scope.item._id+'/providers/',
        data: provider
      })
        .then(function () {
          $scope.loading = false;
          return $scope.getItem();
        })
        .then(function () {
          updateAssoProviders();
        })
        .then(
          function () { }
        , function (err) {
          $scope.loading = false;
          $scope.error = err.message;
        });
    }

  });
