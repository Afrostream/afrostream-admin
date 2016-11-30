'use strict';

angular.module('afrostreamAdminApp')
  .directive('carousel', function () {
    return {
      templateUrl: 'app/carousel/carousel.html',
      restrict: 'E',
      controller: 'CarouselCtrl'
    };
  });
