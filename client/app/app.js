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
    $provide.decorator('taOptions', ['taRegisterTool', 'taSelection', 'taToolFunctions', 'taTranslations', '$delegate', '$uibModal', '$log', '$window', '$http', '$q', function (taRegisterTool, taSelection, taToolFunctions, taTranslations, taOptions, $uibModal, $log, $window, $http, $q) {

      taOptions.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
        ['html', 'insertImage', 'insertLink', 'wordcount', 'charcount']
      ];

      taRegisterTool('uploadImage', {
        buttontext: 'Upload Image',
        iconclass: "fa fa-image",
        action: function (deferred, restoreSelection) {
          var _editor = this.$editor();
          var m = $uibModal.open({
            controller: 'PinUploadImagesDialogController',
            templateUrl: 'app/life/pins/upload.html',
            resolve: {
              type: function () {
                return 'pin-upload';
              }
            }
          }).result.then(
            function (listImages) {
              if (listImages) {

                angular.forEach(listImages, function (value) {
                  var urlLink = 'https://afrostream.imgix.net' + value.path + '?fm=jpg&q=65&w=1280';
                  restoreSelection();
                  _editor.wrapSelection('insertImage', urlLink, true);
                });

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

      taRegisterTool('pushMedia', {
        buttontext: 'Push Media',
        iconclass: "fa fa-youtube-play",
        action: function () {
          var _editor = this.$editor();
          var urlPrompt;
          var blockJavascript = function (link) {
            if (link.toLowerCase().indexOf('javascript') !== -1) {
              return true;
            }
            return false;
          };

          var regexs = {
            spotify: {
              regex: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/,
              idMatchIndex: 1,
              image: function (videoId) {
                var d = $q.defer();
                $http.get('https://api.spotify.com/v1/tracks/' + videoId).success(function (data) {
                  d.resolve(data.album.images[0]['url']);
                });
                return d.promise;
              }
            },
            soundcloud: {
              regex: /^https?:\/\/soundcloud\.com\/\S+\/\S+$/i,
              api: 'https://api.soundcloud.com/resolve.json?url=',
            },
            deezer: {
              regex: /^https?:\/\/(?:www\.)?deezer\.com\/(track|album|playlist)\/(\d+)/i,
              idMatchIndex: 2,
              image: function (videoId) {
                var d = $q.defer();
                $http.jsonp('https://api.deezer.com/track/' + videoId + '?output=jsonp&callback=JSON_CALLBACK').success(function (data) {
                  d.resolve(data.album['cover_big']);
                });
                return d.promise;
              }
            },

            youtube: {
              regex: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/i,
              idMatchIndex: 2,
              image: 'https://img.youtube.com/vi/{videoId}/hqdefault.jpg'
            },
            vimeo: {
              regex: /^https?:\/\/(?:www\.)?vimeo\.com.+?(\d+).*$/i,
              idMatchIndex: 1,
              image: function (videoId) {
                var d = $q.defer();
                $http.jsonp('http://vimeo.com/api/v2/video/' + videoId + '.json?callback=JSON_CALLBACK').success(function (data) {
                  d.resolve(data[0]['thumbnail_large']);
                });
                return d.promise;
              }
            },
            dailymotion: {
              regex: /^.+dailymotion.com\/((video|hub)\/([^_]+))?[^#]*(#video=([^_&]+))?/i,
              idMatchIndex: 3,
              image: 'http://www.dailymotion.com/thumbnail/video/{videoId}'
            }
          };

          var extractEmbedType = function (link) {
            var deferred = $q.defer();

            var typeEmbed = null;

            Object.keys(regexs).forEach(function (key) {
              if (typeEmbed) {
                return;
              }

              var matchType = link.match(regexs[key].regex);
              if (matchType) {
                typeEmbed = regexs[key];
                typeEmbed.type = key;
                typeEmbed.videoId = matchType[typeEmbed.idMatchIndex];

                if (typeEmbed.api) {
                  $http.jsonp(typeEmbed.api + encodeURIComponent(link) + '&client_id=ce512c165ccb0616324228edd18eee86&format=json&callback=JSON_CALLBACK').success(function (data) {
                    typeEmbed.videoId = data.id;
                    typeEmbed.image = data.artwork_url;
                  });
                } else {
                  if (typeof typeEmbed.image === 'function') {
                    return typeEmbed.image(typeEmbed.videoId).then(function (result) {
                      typeEmbed.imageUrl = result;
                      deferred.resolve(typeEmbed);
                    })
                  } else {
                    typeEmbed.imageUrl = typeEmbed.image.replace('{videoId}', typeEmbed.videoId)
                  }
                }
                deferred.resolve(typeEmbed);
              }

            });

            return deferred.promise;
          };

          //PROMPT TITLE
          var titlePrompt = taTranslations.insertVideo.dialogPrompt + '(';
          Object.keys(regexs).forEach(function (key) {
            titlePrompt += key + ' | '
          });

          titlePrompt += ')';

          //PROMPT TITLE

          urlPrompt = $window.prompt(titlePrompt, 'https://');

          if (!blockJavascript(urlPrompt)) {

            if (urlPrompt && urlPrompt !== '' && urlPrompt !== 'https://') {

              extractEmbedType(urlPrompt).then(function (embed) {
                if (embed) {
                  var urlLink = urlPrompt;
                  var embed = '<div class="ta-insert-video" ta-insert-video="' + urlLink + '" ta-insert-type="' + embed.type + '" ><img src="' + embed.imageUrl + '" /></div>';
                  if (taSelection.getSelectionElement().tagName && taSelection.getSelectionElement().tagName.toLowerCase() === 'a') {
                    taSelection.setSelectionAfterElement(taSelection.getSelectionElement());
                  }
                  return _editor.wrapSelection('insertHTML', embed, true);
                }
              });
            }
          }
        },
        onElementSelect: {
          element: 'img',
          onlyWithAttrs: ['ta-insert-video'],
          action: taToolFunctions.imgOnSelectAction
        }
      });

      taOptions.toolbar[1].push('pushMedia');
      return taOptions;
    }]);
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
