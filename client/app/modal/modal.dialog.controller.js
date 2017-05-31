'use strict';

angular.module('afrostreamAdminApp')
  .controller('ModalDialogCtrl', function ($scope, $sce, $log, $http, $uibModalInstance, item, type, Slug, ngToast, Image, $timeout, $uibModal, ModalUtils) {
    $scope.onPasteWisiwyg = function (html) {
      return $sanitize(html)
    }

    $scope.toHumanDate = function (date) {
      var d = moment(date);
      return d.isValid() ? d.toString() : '';
    }

    $scope.modalType = type;

    $scope.modalHooks = {};

    var close = function (cancel) {
      $uibModalInstance.close();
      if (typeof $uibModalInstance.onClose === 'function') {
        $uibModalInstance.onClose(cancel);
      }
    };

    var getTitle = function (item) {
      return item.title || item.label || item.name || item.target || ((item.firstName || item.lastName) ? item.firstName + ' ' + item.lastName : '' );
    };

    $scope.isFilm = function () {
      return type === 'movie' || type === 'serie';
    };
    $scope.isSeason = function () {
      return type === 'season';
    };
    $scope.isEpisode = function () {
      return type === 'episode';
    };

    $scope.slugify = function (input) {
      $scope.item.slug = Slug.slugify(input);
    };

    $scope.searchFields = function (path, query) {
      return $http.get('/api/' + path, {
        params: {
          query: query,
        }
      }).then(function (result) {
        return result.data;
      });
    };

    $scope.extractProfile = function (image, ratio) {
      if (!image) {
        return;
      }
      var base = '?crop=faces&fit=facearea&w=240&h=465&q=65&fm=jpg&facepad=1.5';
      var rect;
      var profiles = image.profiles;
      if (profiles) {
        try {
          rect = profiles.hasOwnProperty(ratio) && profiles[ratio];
        } catch (e) {
          $log.debug(e);
        }
      }
      if (rect) {
        base = base + (rect && '&rect=' + _.values(rect).join());
      }
      return base;
    };

    $scope.typeaheadOpts = {
      minLength: 3,
      templateUrl: '/path/to/my/template.html',
      waitMs: 500,
      allowsEditable: true
    };

    $scope.cancel = function () {
      close(true);
    };

    $scope.addItem = ModalUtils.createHandlerAddItem({
      $scope: $scope,
      close: close
    });

    $scope.scrapItem = function () {
      $http.post('/api/' + $scope.directiveType + '/scrap', $scope.item).then(function (result) {
        ngToast.create({
          content: 'L\'objet ' + $scope.directiveType + ' à été scrappé'
        });
        $scope.scrappedData = $scope.item = result.data;
      }, function (err) {
        showError();
        $log.debug(err);
      });
    };

    $scope.updateItem = ModalUtils.createHandlerUpdateItem({
      $scope: $scope,
      close: close
    });

    $scope.deleteItem = ModalUtils.createHandlerDeleteItem({
      $scope: $scope,
      close: close
    });

    $scope.uploadImage = function (type, key) {
      var imgType = type || 'poster';
      var imgKey = key || imgType;
      var m = $uibModal.open({
        templateUrl: 'app/images/modal/upload.dialog.html',
        controller: 'ImagesUploadDialogCtrl',
        size: 'lg',
        scope: $scope,
        resolve: {
          type: function () {
            return imgType;
          }
        }
      });
      m.onClose = function (image) {
        if (image) {
          $scope.item[imgKey] = image;
        }
      };
    };


    $scope.cropImage = function (image, ratio) {
      var m = $uibModal.open({
        templateUrl: 'app/images/modal/crop.html',
        controller: 'ImagesCropDialogCtrl',
        size: 'lg',
        scope: $scope,
        resolve: {
          image: function () {
            return image;
          },
          ratio: function () {
            return ratio;
          }
        }
      });
    };

    //// COUNTRIES ////
    var updateScopeCountriesProps = function () {
      $scope.countriesProps = {
        countries: $scope.item && $scope.item.countries || [],
        onChange: function (countries) {
          $scope.item.countries = countries;
        }
      };

      $scope.countriesOutProps = {
        countries: $scope.item && $scope.item.countriesOut || [],
        onChange: function (countriesOut) {
          $scope.item.countriesOut = countriesOut;
        }
      };
    }
    updateScopeCountriesProps();
    $scope.$watch('item', updateScopeCountriesProps);


    //// BROADCASTERS ///
    var updateScopeBroadcastersProps = function () {
      $scope.broadcastersProps = {
        broadcasters: $scope.item && $scope.item.broadcasters || [],
        onChange: function (broadcasters) {
          $scope.item.broadcasters = broadcasters;
        }
      };
    }
    updateScopeBroadcastersProps();
    $scope.$watch('item', updateScopeBroadcastersProps);

    //// UpdateScope ////

    $scope.getItem = ModalUtils.createHandlerGetItem($scope, item);

    var showError = function () {
      ngToast.create({
        className: 'warning',
        content: 'API Error'
      });
    };

    //======= DATE =======//
    $scope.disabled = function (date, mode) {
      return false; // ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    //
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.format = 'yyyy-MM-dd';

    $scope.loadImages = function (query, param) {
      var p = Image.query({query: query, type: param}).$promise;
      p.then(function (response) {
        return response;
      });
      return p;
    };



    // getItem is often triggered before modal hooks are binded (directives aren't yet loaded)
    //  so this timeout is a quick fix & not the proper way of mitigating the pb
    $timeout(function () {
      $scope.getItem();
    }, 100);

    $scope.tags = [];
    $scope.$watch('item', function (item) {
      $scope.tags = [];
      if (item && item.keywords) {
        angular.forEach(item.keywords, function (value) {
          $scope.tags.push({
            text: value
          })
        });
      }
    }, true);

    $scope.$watch('tags', function (tags) {
      if ($scope.item) {
        $scope.item.keywords = [];
        angular.forEach(tags, function (value) {
          $scope.item.keywords.push(value.text);
        })
      }
    }, true);
  });
