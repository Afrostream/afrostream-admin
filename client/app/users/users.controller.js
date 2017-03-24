'use strict';

angular.module('afrostreamAdminApp')
  .controller('UsersCtrl', function ($scope, $http, ngToast) {

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
      var params = ['name', 'first_name', 'last_name', 'email'];
      params.forEach((function(param) {
        if ($scope.item[param] === null) {
          delete $scope.item[param];
        }
      }).bind(this));
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


    $scope.cancelSubscription = function(event) {
      var validation = confirm("Are you sure you want to cancel the current subscription ?");
      if (validation === true) {
        return $http({
          method: 'PUT',
          url: '/api/subscriptions/cancel',
          params: {subscriptionId: event.target.getAttribute('data-subscriptionbillinguuid')}
        })
          .then((function (result) {
            if (result.status == 200) {
              ngToast.create({
                content: 'Done :)'
              });
            } else {
              alert('Error: '+result.statusMessage+"\nError code: "+result.statusCode);
            }
            this.loadSubscriptions();
          }).bind(this))
          .catch((function() {
            alert('Something bad happened :(');
            this.loadSubscriptions();
          }).bind(this));
      }
    };
    $scope.expireSubscription = function(event) {
      var uuid = event.target.getAttribute('data-subscriptionbillinguuid');
      var submodal = document.getElementById('subscription-expire-submodal');
      submodal.classList.remove('active'); // if already opened by another one, because we dont have overlay
      var uuidField = document.getElementById('subscriptionBillingUuid');
      uuidField.value = uuid;
      // make initial choices
      this.isRefundEnabled = false;
      document.getElementById('isRefundEnabled')['checked'] = false;
      // active submodal
      submodal.classList.add('active');
    }
    $scope.toggleRefund = function(event) {
      this.isRefundEnabled = event.target["checked"];
    }
    $scope.toggleRefundProrated = function(event) {
      var isRefundProrated = document.getElementById('isRefundProrated');
      var isFullRefund = document.getElementById('isFullRefund');
      if (event.target === isRefundProrated) {
        isFullRefund["checked"] = !isFullRefund["checked"];
      } else {
        isRefundProrated["checked"] = !isRefundProrated["checked"];
      }
    }
    $scope.cancelExpireSubscription = function(event) {
      var submodal = document.getElementById('subscription-expire-submodal');
      submodal.classList.remove('active');
    }
    $scope.processExpireSubscription = function(event) {
      var isRefundProrated = false;
      var uuidField = document.getElementById('subscriptionBillingUuid');
      var submodal = document.getElementById('subscription-expire-submodal');
      var isRefundEnabled = document.getElementById('isRefundEnabled')["checked"];
      var refundProratedField = document.getElementById('isRefundProrated');
      if (refundProratedField) {
        var isRefundProrated = refundProratedField["checked"] && isRefundEnabled;
      }
      submodal.classList.remove('active');
      var validation = confirm("Are you sure you want to expire the current subscription ?");
      if (validation === true) {
        return $http({
          method: 'PUT',
          url: '/api/subscriptions/expire',
          params: {
            subscriptionId: uuidField.value,
            forceBeforeEndsDate: true,
            isRefundEnabled: isRefundEnabled,
            isRefundProrated: isRefundProrated
          }
        })
          .then(function (result) {
            if (result.status == 200) {
              ngToast.create({
                content: 'Done :)'
              });
            } else {
              alert('Error: '+result.statusMessage+"\nError code: "+result.statusCode);
            }
            this.loadSubscriptions();
          })
          .catch((function() {
            this.loadSubscriptions();
            alert('Something bad happened :(');
          }).bind(this));
      }
    };
    $scope.reactiveSubscription = function(event) {
      var validation = confirm("Are you sure you want to reactive the current subscription ?");
      if (validation === true) {
        return $http({
          method: 'PUT',
          url: '/api/subscriptions/reactive',
          params: {subscriptionId: event.target.getAttribute('data-subscriptionbillinguuid')}
        })
          .then((function (result) {
            if (result.status == 200) {
              ngToast.create({
                content: 'Done :)'
              });
            } else {
              alert('Error: '+result.statusMessage+"\nError code: "+result.statusCode);
            }
            this.loadSubscriptions();
          }).bind(this))
          .catch((function() {
            this.loadSubscriptions();
            alert('Something bad happened :(');
          }).bind(this));
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
