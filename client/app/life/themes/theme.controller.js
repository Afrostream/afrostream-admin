'use strict';

angular.module('afrostreamAdminApp')
  .controller('LifeThemeCtrl', function ($scope, LifePin) {
    $scope.tags = [];
    $scope.$watch('item.keywords', function (keywords) {
      $scope.tags = [];
      angular.forEach(keywords, function (value, key) {
        $scope.tags.push({
          text: value
        })
      });
    }, true);

    $scope.$watch('tags', function (tags) {
      $scope.item.keywords = [];
      angular.forEach(tags, function (value, key) {
        $scope.item.keywords.push(value.text);
      })
    }, true);

    $scope.loadLifePin = function (query) {
      return LifePin.query({query: query}).$promise;
    };
  });
