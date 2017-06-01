'use strict';

/**
 * simplified version of images.dialog (single upload)
 */
angular.module('afrostreamAdminApp')
  .controller('ImagesUploadDialogCtrl', function ($scope, $log, $cookies, $uibModalInstance, FileUploader, type) {
    $scope.type = type;

    var uploader = $scope.uploader = new FileUploader({
      url: 'api/images?type=' + $scope.type,
      queueLimit: 1
    });

    uploader.onBeforeUploadItem = function (item) {
      $log.debug('upload : ', item);
      item.headers['Access-Token'] = $cookies.get('token');
    };

    uploader.onCompleteItem = function (item, response) {
      close(response);
    };

    var close = function () {
      $uibModalInstance.close();
      if (typeof $uibModalInstance.onClose === 'function') {
        $uibModalInstance.onClose.apply($uibModalInstance, arguments);
      }
    };
  });
