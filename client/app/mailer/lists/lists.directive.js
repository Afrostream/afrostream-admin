'use strict';

angular.module('afrostreamAdminApp')
  .directive('pins', function () {
    return {
      templateUrl: 'app/mailer/lists/lists.html',
      restrict: 'E',
      controller: 'MailerListCtrl'
    };
  });
