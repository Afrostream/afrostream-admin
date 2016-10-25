'use strict';

angular.module('afrostreamAdminApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  //UPLOAD
  'angularFileUpload',
  //Slug helper
  'slugifier',
  'ngToast',
  'ngTagsInput',
  'ui.bootstrap-slider',
  'ui.bootstrap.tabs',
  'ui.sortable',
  'textAngular',
  'angularUtils.directives.dirPagination',
  //IMAGE cropper
  'ngImgCrop',
  'ngFileToJson',
  'ui.grid'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    // inlining micro backo interceptor.
    // this interceptor will add ?backo=1 to every /api/* requests.
    $httpProvider.interceptors.push(function () {
      return {
        'request': function (config) {
          if (config && config.url && config.url.match(/^\/api\/.*/)) {
            config.params = config.params || {};
            config.params.backo = 1;
            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/json';
          }
          return config;
        }
      };
    });
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookies, $injector) {
    var state;
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        // avoid adding Authorization headers to cross domain requests.
        if (config.url && config.url.substr(0, 4) === 'http') {
          return config;
        }
        if ($cookies.get('token')) {
          config.headers['Access-Token'] = $cookies.get('token');
          //config.headers.Authorization = config.headers.Authorization || 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
  .config(['ngToastProvider', function (ngToastProvider) {
    ngToastProvider.configure({
      animation: 'slide' // or 'fade'
    });
  }])
  //Text wisiwyg editor
  .config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', 'taSelection', '$delegate', '$uibModal', '$log', function (taRegisterTool, taSelection, taOptions, $uibModal, $log) {
      taRegisterTool('uploadImage', {
        buttontext: 'Upload Image',
        iconclass: "fa fa-image",
        action: function (deferred, restoreSelection) {
          var _editor = this.$editor();
          var m = $uibModal.open({
            controller: 'UploadImageModalInstance',
            templateUrl: 'app/images/modal/upload.html',
            resolve: {
              type: function () {
                return 'pin-upload';
              }
            }
          }).result.then(
            function (image) {
              if (image) {
                var urlLink = 'https://afrostream.imgix.net' + image.path + '?fm=jpg&q=65&w=1280';
                restoreSelection();
                _editor.wrapSelection('insertImage', urlLink, true);
                deferred.resolve();
              }
            },
            function () {
              deferred.resolve();
            }
          );
          return false;
        }
      });
      taOptions.toolbar[1].push('uploadImage');
      return taOptions;
    }]);
  })
  .controller('UploadImageModalInstance', function ($scope, $log, type, $cookies, $uibModalInstance, FileUploader) {

    var uploader = $scope.uploader = new FileUploader({
      url: 'api/images?type=' + type,
      queueLimit: 1
    });

    uploader.onBeforeUploadItem = function (item) {
      item.headers['Access-Token'] = $cookies.get('token');
    };

    uploader.onCompleteItem = function (item, data) {
      $scope.image = data;
      close();
    };

    var close = function () {
      $uibModalInstance.close($scope.image);
    };
  })
  .run(function ($rootScope, $state, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedIn(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $state.go('login');
        }
      });
    });
  });
