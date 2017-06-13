'use strict';

angular.module('afrostreamAdminApp')
  .controller('PfCtrl', function ($scope, $http, $interval, jobs) {
    $scope.loading = true;
    $scope.profileList = [];
    $scope.broadcasterList = [];
    $http.get('/api/nodePF/profiles').then(function (result) {
      $scope.profileList = result.data;
      $scope.profileList.sort(function (profileA, profileB) {

        var nameA = profileA.broadcaster + profileA.name;
        var nameB = profileB.broadcaster + profileB.name;

        if (nameA > nameB) return 1;
        if (nameA < nameB) return -1;
        return 0;
      });

      $scope.loading = false;
      $scope.broadcasterList = result.data.reduce(
        function (p, c) {
          var broadcasterName = c.broadcaster;
          if (p.indexOf(broadcasterName) === -1 && broadcasterName) {
            p.push(broadcasterName);
          }
          return p;
        }, []).map(function (broadcasterName) {
          return { name: broadcasterName };
        });
    });

    $scope.search = {};
    $scope.searchByContentId = function () {
      $scope.pfContentIdList = [ $scope.search.pfContentId ];
      $scope.updateResults()
    };

    $scope.pfContentIdList = [];
    $scope.search = {};
    $scope.search.title = '';
    $scope.search.videoId = '';
    $scope.search.episodeId = '';
    $scope.search.movieId = '';
    $scope.search.pfMd5Hash = '';
    $scope.search.pfContentId = '';

    //var baseUrl = 'http://p-afsmsch-001.afrostream.tv:4042';
    // /api/contents/12858'?populate=assets.preset.profile
    $scope.pfContentList = [];

    $scope.search = function () {
      $http.get('/api/nodePF/contents', {
        params: {
          title: $scope.search.title,
          videoId: $scope.search.videoId,
          episodeId: $scope.search.episodeId,
          movieId: $scope.search.movieId,
          pfMd5Hash: $scope.search.pfMd5Hash,
          contentId: $scope.search.pfContentId
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
      });
    };

    $scope.transcodeAllBroadcasters = function (options) {
      var broadcasterNames = $scope.broadcasterList.map(
        function (broadcaster) {
          return broadcaster.name
        }
      );
      return $http.get('/api/pf/transcode', {
        params: {
          pfMd5Hash: options.pfContent.md5Hash,
          broadcasters: broadcasterNames.join(',')
        }
      });
    };

    $scope.transcode = function (options) {
      if (options.profile) {
        return $http.get('/api/pf/transcode', {
          params: {
            pfMd5Hash: options.pfContent.md5Hash,
            profileIds: options.profile.profileId
          }
        });
      } else {
        return $http.get('/api/pf/transcode', {
          params: {
            pfMd5Hash: options.pfContent.md5Hash,
            broadcasters: options.broadcaster.name
          }
        });
      }
    };

    $scope.uploadToBouyguesSFTP = function (options) {
      return $http.get('/api/nodePF/uploadToBouyguesSFTP', {
        params: {
          contentId: options.pfContent.contentId
        }
      });
    };
  });
