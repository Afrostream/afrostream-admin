'use strict';

angular.module('afrostreamAdminApp')
  .controller('PinsCtrl', function ($scope, Slug) {
    $scope.slugify = function (input) {
      $scope.item.slug = Slug.slugify(input);
    };
  });
