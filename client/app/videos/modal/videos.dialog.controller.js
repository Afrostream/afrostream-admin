'use strict';

angular.module('afrostreamAdminApp')
  .controller('VideosDialogCtrl', function ($scope, $sce, $log, $http, $cookies, $uibModalInstance, item, ngToast, Pf, FileUploader) {
    /*
      [
        {
          profilesIds: [
            2,
            3,
            16,
            19
          ],
          contentId: 9,
          uuid: "c6832cf78025bcbb",
          md5Hash: "970d6b11419333e87d712fa7e3175b6b",
          filename: "/space/videos/sources/24hourlove_TRL.mov",
          state: "ready",
          size: 219619857,
          duration: "00:01:53",
          uspPackage: "disabled",
          drm: "disabled",
          createdAt: "2016-04-13 13:39:52",
          updatedAt: "2016-09-27 19:33:01",
          video: {
          _id: "c3b88dda-3c7f-43f3-9557-6274231efa8a",
          name: "24hourlove_TRL.mov",
          duration: 113
        }
      ]
    */
    $scope.pfContents = null;
    $scope.searchField = '';

    function loadPfContent() {
      Pf.getContents().then(function (pfContents) {
        $scope.pfContents = pfContents;
      });
    }
    loadPfContent();

    $scope.import = function (pfContent) {
      $http.get('/api/videos/importFromPfContent', { params: { pfContentId: pfContent.contentId } })
        .then(function (result) {
          if (result && result.data && result.data._id) {
            pfContent.video = result.data;
            ngToast.create({
              content: 'La video' + result.data._id + ' à été créée'
            });
          } else {
            ngToast.create({
              content: 'Erreur d\'import'
            });
          }
        }, function (err) {
          ngToast.create({
            content: 'Erreor d\'import : ' + err.message
          });
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
    };
  });
