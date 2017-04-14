'use strict';

angular.module('afrostreamAdminApp')
  .controller('LifeThemeCtrl', function ($scope, LifePin) {

    $scope.$watch('item.keywords', function (keywords) {
      $scope.tags = [];
      angular.forEach(keywords, function (key, value) {
        $scope.tags.push({
          text: value
        })
      });
    }, true);

    $scope.$watch('tags', function (tags) {
      $scope.item.keywords = [];
      for (var key in tags) {
        $scope.item.keywords.push(tags[key].text);
      }
    }, true);

    $scope.loadLifePin = function (query) {
      return LifePin.query({query: query}).$promise;
    };
  });
