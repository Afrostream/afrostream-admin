'use strict';

angular.module('afrostreamAdminApp')
  .directive('lifeTheme', function () {
    return {
      templateUrl: 'app/life/pins/themes/theme.html',
      restrict: 'E',
      controller: 'LifeThemeCtrl'
    };
  });
