'use strict';

angular.module('afrostreamAdminApp')
  .directive('notifications', function () {
    return {
      templateUrl: 'app/notifications/notifications.html',
      restrict: 'E',
      controller: 'NotificationsCtrl'
    };
  });
