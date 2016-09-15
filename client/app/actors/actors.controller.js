'use strict';

angular.module('afrostreamAdminApp')
  .controller('ActorsCtrl', function ($scope, Image, $uibModal) {
    $scope.loadImages = function (query, param) {
      var p = Image.query({query: query, type: param}).$promise;
      p.then(function (response) {
        return response;
      });
      return p;
    };

    $scope.uploadPicture = function () {
      var m = $uibModal.open({
        templateUrl: 'app/images/modal/upload.html',
        controller: 'ImagesUploadDialogCtrl',
        size: 'lg',
        scope: $scope,
        resolve: {
          type: function () {
            return 'actor';
          }
        }
      });
      m.onClose = function (image) {
        if (image) {
          $scope.item.picture = image;
        }
      };
    };
  });
