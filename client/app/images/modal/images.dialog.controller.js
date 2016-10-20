'use strict';

angular.module('afrostreamAdminApp')
  .controller('ImagesDialogCtrl', function ($scope, $sce, $log, $http, $cookies, $uibModalInstance, item, list, type, Image, ngToast, FileUploader) {

    $scope.item = item;

    $scope.item.type = $scope.item.type || type;
    $scope.directiveType = type + 's';
    $scope.list = list || [];

    $scope.cancel = function () {
      $uibModalInstance.close();
    };

    $scope.updateItem = function () {
      $http.put('/api/' + $scope.directiveType + '/' + $scope.item._id, $scope.item + '?type=' + ($scope.item.file.imgType || $scope.item.type)).then(function (result) {
        ngToast.create({
          content: 'La ' + $scope.item.type + ' ' + result.data.title + ' à été Uploadé'
        });
        $uibModalInstance.close();
      }, function (err) {
        showError();
        $log.debug(err.statusText);
      });
    };

    var showError = function () {
      ngToast.create({
        className: 'warning',
        content: 'Erreur lors de l\'ajout a aws '
      });
    };

    var uploader = $scope.uploader = new FileUploader({
      url: 'api/' + $scope.directiveType + '/' + '?type=' + ($scope.item.file && $scope.item.file.imgType || $scope.item.type)
    });

    // CALLBACKS
    uploader.onBeforeUploadItem = function (item) {
      item.headers['Access-Token'] = $cookies.get('token');
    };

    uploader.onCompleteItem = function (item, response) {
      $scope.list.push(response);
    };

  });
