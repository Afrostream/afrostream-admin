'use strict';

angular.module('afrostreamAdminApp')
  .directive('mailer', function () {
    return {
      templateUrl: 'app/mailer/mailer.html',
      restrict: 'E',
      controller: 'MailerCtrl'
    };
  });
