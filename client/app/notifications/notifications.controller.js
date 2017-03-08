'use strict';

angular.module('afrostreamAdminApp')
  .controller('NotificationsCtrl', function ($scope, $filter, $http, ngToast) {
    $scope.jsonString = null;
    $scope.$watch('item', function (item) {
      var json = item && item.data || {
          "picture_url": "https://images.cdn.afrostream.net/production/carousel/apercu_catalogue_desktop_slide1.png?crop=faces&fit=clip&w=300&q=100&fm=jpg",
          "action": "open_video",
          "movieID": "139",
          "open_url": "https://www.youtube.com/watch?v=7500WJMFzBY"
        };
      $scope.jsonString = $filter('json')(json);
    }, true);

    $scope.$watch('jsonString', function (json) {
      if (!$scope.item) {
        $scope.wellFormed = false;
        return;
      }
      try {
        $scope.item.data = JSON.parse(json);
        $scope.wellFormed = true;
      } catch (e) {
        $scope.wellFormed = false;
      }
    }, true);

    $scope.pushNotification = function () {
      $http.put('/api/notifications/' + $scope.item._id + '/deploy', $scope.item).then(function () {
        ngToast.create({
          content: 'Notification - > ' + $scope.item._id + 'deployed'
        });
      }, function (err) {
        ngToast.create({
          className: 'warning',
          content: 'Notification - > ' + $scope.item._id + 'error ' + err.data.message
        });
      })
    }
  });
