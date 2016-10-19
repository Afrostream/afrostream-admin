'use strict';

/**
 * simplified version of images.dialog (single upload)
 */
angular.module('afrostreamAdminApp')
  .controller('ImagesUploadDialogCtrl', function ($scope, $log, $cookies, $uibModalInstance, FileUploader, type) {
    $scope.type = type;

    var uploader = $scope.uploader = new FileUploader({
      url: 'api/images',
      queueLimit: 1
    });

    uploader.onBeforeUploadItem = function (item) {
      $log.debug('upload : ', item);
      item.formData.push({dataType: item.file.dataType || $scope.type || type || 'poster'});
      item.headers['Access-Token'] = $cookies.get('token');
      //item.headers.Authorization = item.headers.Authorization || 'Bearer ' + $cookies.get('token');
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
