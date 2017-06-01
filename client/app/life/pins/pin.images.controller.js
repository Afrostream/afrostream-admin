'use strict';

angular.module('afrostreamAdminApp')
  .controller('PinUploadImagesDialogController', function ($scope, $log, type, $cookies, $uibModalInstance, FileUploader) {
    $scope.list = [];

    var uploader = $scope.uploader = new FileUploader({
      url: 'api/images?type=' + type,
      queueLimit: 10
    });

    uploader.onBeforeUploadItem = function (item) {
      item.headers['Access-Token'] = $cookies.get('token');
    };

    uploader.onCompleteItem = function (item, data) {
      $scope.list.push(data);
    };

    uploader.onCompleteAll = function () {
      close();
    };

    var close = function () {
      $uibModalInstance.close($scope.list);
    };
  });
