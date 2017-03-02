'use strict';

angular.module('afrostreamAdminApp')
  .controller('UsersCtrl', function ($scope, $http) {

    $scope.passwordEditionMode = true;
    $scope.accessTokens = [];
    $scope.modalHooks.onItemLoaded = function () {
      $http({method:'GET', url: '/api/logs/', params: { userId: $scope.item._id,  type: 'access_token' } }).then(function (result) {
        $scope.accessTokens = result.data;
      });

      // load the subscriptions of selected user, to display on the page
      $scope.loadSubscriptions();
    };

    /**
     * prepare the item for an update
     */
    $scope.modalHooks.beforeUpdate = function() {
      delete $scope.item.bouyguesId;
      delete $scope.item.ise2;
      delete $scope.item.account_code;
      delete $scope.item.avatarImageId;
      delete $scope.item.billing_provider;
      delete $scope.item.bouygues;
      delete $scope.item.facebook;
      delete $scope.item.followers;
      delete $scope.item.github;
      delete $scope.item.google;
      delete $scope.item.languageId;
      delete $scope.item.nationality;
      delete $scope.item.orange;
      delete $scope.item.picture;
      delete $scope.item.provider;
      delete $scope.item.splashList;
      delete $scope.item.token;
      delete $scope.item.updatedAt;
    }

    /**
     * Return a brand new randomly generated password
     * @returns {Promise}
     */
    $scope.generateRandomPassword = function() {
      var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    };

    /**
     * check if password is here and push it to the server to store it
     * @returns {Promise}
     */
    $scope.saveNewPassword = function() {
      if ($scope.item.newPassword) {
        return $http({
          method: 'PUT',
          url: '/api/users/password',
          params: {email: $scope.item.email, password: $scope.item.newPassword}
        })
          .then(function (result) {
            if (result.status != 200) {
              $scope.item.newPassword = "";
            }
          });
      } else {
        // do nothing
      }
    };

    $scope.getNewPassword = function() {
      $scope.item.newPassword = $scope.generateRandomPassword();
    };

    /**
     * This method will create and push a new password automatically
     */
    $scope.autoResetPwd = function() {

      $scope.generateRandomPassword()
        .then(function(pwd) {
          $scope.item.newPassword = pwd;
          $scope.saveNewPassword();
        });
    };

    $scope.togglePasswordEdition = function() {
      if ($scope.passwordEditionMode) {
        $scope.passwordEditionMode = false;
      } else {
        $scope.passwordEditionMode = true;
      }
    };

    $scope.toggleCurrentFieldset = function(event) {
      if (event.target.parentElement.classList.contains('open')) {
        event.target.parentElement.classList.remove('open');
      } else {
        event.target.parentElement.classList.add('open');
      }
    };

    /**
     * Find the subscriptions for selected user
     * @returns {*}
     */
    $scope.loadSubscriptions = function() {
      return $http({
        method: 'GET',
        url: '/api/subscriptions/status',
        params: {
          userId: $scope.item._id
        }
      })
        .then(function(result) {
          $scope.subscriptions = result.data.subscriptions;
        });
    };

    // utilities

    /**
     * get the Video quality stringified name from the quality value
     * @param qualityIndex : databased quality value
     * @return String
     */
    $scope.getQuality = function(qualityIndex) {
      var index = parseInt(qualityIndex, 10);
      var qualities = [
        'Auto',
        'Low',
        'Medium',
        'Normal',
        'HD',
        'Full HD'
      ]
      return qualities[index];
    }

  });
