'use strict';

angular.module('afrostreamAdminApp')
  .controller('PfCtrl', function ($scope, $http, $interval, jobs) {
    $scope.search = {};
    $scope.searchByContentId = function () {
      $scope.pfContentIdList = [ $scope.search.pfContentId ];
      $scope.updateResults()
    };

    $scope.pfContentIdList = [];
    $scope.searchTitle = '';
    $scope.searchVideoId = '';
    $scope.searchEpisodeId = '';
    $scope.searchMovieId = '';
    $scope.searchPfMd5Hash = '7684d1d07b72e4f912545362c2cb2ded';
    $scope.searchPfContentId = '';

    //var baseUrl = 'http://p-afsmsch-001.afrostream.tv:4042';
    // /api/contents/12858'?populate=assets.preset.profile

    $scope.pfContentList = [];

    $scope.search = function () {
      $http.get('/api/nodePF/contents', {
        params: {
          title: $scope.searchTitle,
          videoId: $scope.searchVideoId,
          episodeId: $scope.searchEpisodeId,
          movieId: $scope.searchMovieId,
          pfMd5Hash: $scope.searchPfMd5Hash,
          contentId: $scope.searchPfContentId
        }
      }).then(function (result) {
        /*
          {
            assets:[{assetId: 28531, contentId: 9, presetId: 10, assetIdDependance: null,…},…]
            contentId:9
            createdAt:"2016-04-13T09:39:52.000Z"
            drm:"disabled"
            duration:"00:01:53"
            filename:"/space/videos/sources/24hourlove_TRL.mov"
            md5Hash:"970d6b11419333e87d712fa7e3175b6b"
            size:219619857
            state:"ready"
            streams:[{contentsStreamId: 7374, contentId: 9, mapId: 0, type: "video", language: "eng", codec: "h264",…},…]
            updatedAt:"2016-09-27T15:33:01.000Z"
            uspPackage:"disabled"
            uuid:"c6832cf78025bcbb"
          }
        */
        $scope.pfContentList = result.data.map(function (content) {
          content.broadcasters = [
            /*{
                name: ... ,
                profiles: [ {name:..., id:...}, ... ]
              }*/
          ];
          content.assets.forEach(function (asset) {
            var broadcasterName = asset.preset.profile.broadcaster;
            var profileName = asset.preset.profile.name;
            var profileId = asset.preset.profile.id;

            // search the broadcaster
            var broadcaster = content.broadcasters.filter(
              function (b) {
                return b.name === broadcasterName;
              }
            ).pop();

            if (!broadcaster) {
              broadcaster = {
                name: broadcasterName,
                profiles: []
              };
              content.broadcasters.push(broadcaster);
            }

            //
            var profile = broadcaster.profiles.filter(function (profile) {
              return profile.name === profileName;
            }).pop();

            if (!profile) {
              profile = {
                name: profileName,
                id: profileId
              };
              broadcaster.profiles.push(profile);
            }
          });

          return content;
        });
        console.log($scope.pfContentList);
      });
    };
  });
