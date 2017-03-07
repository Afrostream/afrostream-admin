'use strict';

angular.module('afrostreamAdminApp')
  .filter('DataFormater', function () {
    return function (items) {
      items.forEach(function (item) {
        item.genericTitle = item.title
          || item.label
          || item.name
          || item.target
          || ((item.firstName || item.lastName) ? item.firstName + ' ' + item.lastName : '' );
        item.genericThumb = (item.imgix ? item : item.thumb) || item.picture;
      });
      return items;
    };
  })
  .controller('DataCtrl', function ($scope, $log, $http, $uibModal, ngToast, $state, Modal, genres, countries, $window) {
    var defaultPerPage = 30;

    $scope.type = $state.current.type || 'movie';
    $scope.items = [];
    $scope.filterList = "all";
    $scope.itemsPerPage = defaultPerPage;
    $scope.totalItems = 0;
    $scope.currentItem = {};
    $scope.searchField = '';
    $scope.sortable = ($scope.type == 'category');
    $scope.apiRessourceUrl = '/api/' + $scope.type + 's';
    $scope.apiParamsUrl = {
      query: $scope.searchField
    };
    $scope.pagination = {current: 1};
    $scope.countries = countries;
    $scope.genres = genres;

    $scope.reload = function () {
      $scope.loadPage($scope.pagination.current);
    };

    $scope.filterUserToggle = function (filter) {
      $scope.filterList = filter;
    };

    $scope.filterListFunction = function (element) {
      switch ($scope.filterList) {
        case "mine":
          return element.userId == $scope.user._id;
        case "others":
          return element.userId != $scope.user._id;
        default:
          return true;
      }
    };

    $scope.loadPage = function (page) {
      // new current page
      $scope.pagination.current = page;
      //
      return loadItems(page, $scope.searchField)
    };

    $scope.loadItem = function (id) {
      // this is just an example, in reality this stuff should be in a service
      return $http.get($scope.apiRessourceUrl + "/" + id, {
        params: {},
        headers: angular.extend(
          {},
          $scope.headers,
          {}
        )
      })
        .then(function (result) {
          return result.data;
        });
    };

    function loadItems (pageNumber, query) {
      // this is just an example, in reality this stuff should be in a service
      return $http.get($scope.apiRessourceUrl, {
        params: {query: query},
        headers: angular.extend(
          {},
          $scope.headers,
          {
            // @see https://www.npmjs.com/package/range-parser
            'Range': 'items=' + ((pageNumber - 1) * $scope.itemsPerPage) + '-' + ((pageNumber) * $scope.itemsPerPage)
          }
        )
      })
        .then(function (result) {
          $scope.items = result.data;
          $scope.totalItems = result.headers('Resource-Count') || result.data.length;
          $scope.numPages = Math.ceil($scope.totalItems / ($scope.itemsPerPage || defaultPerPage));
        });
    }

    $scope.editFromHash = function () {
      var parameters = window.location.hash.substring(1, window.location.hash.length).split("=");
      if (parameters["0"] === "id") {
        var dataId = parameters[1];
        $scope.loadItem(dataId)
          .then(function (item) {
            $scope.editIndex(item);
          });
      }
      if (parameters["0"] === "query") {
        var dataEmail = parameters[1];
        loadItems(1, dataEmail)
          .then(function () {
            if ($scope.items.length === 1) {
              $scope.editIndex($scope.items[0]);
            }

          });
      }
    };

    $scope.loadPage($scope.pagination.current)
      .then($scope.editFromHash);

    $scope.$watch('searchField', function (val) {
      if (!val) return;
      $scope.loadPage(1);
      window.location.hash = "#query=" + val;
    });

    var modalOpts = {
      templateUrl: $state.current.modalTemplateUrl || 'app/modal/modal.html', // Url du template HTML
      controller: $state.current.modalCtrl || 'ModalDialogCtrl',
      size: 'lg',
      scope: $scope,
      resolve: {
        item: function () {
          return $scope.currentItem;
        },
        type: function () {
          return $scope.type;
        }
      }
    };
    var modalNewOpts = modalOpts;
    var modalEditOpts = modalOpts;

    //////////// EXCEPTION IMAGE /////////////////
    if ($scope.type === 'image') {
      modalNewOpts = {
        templateUrl: 'app/images/modal/images.html', // Url du template HTML
        controller: 'ImagesDialogCtrl',
        size: 'lg',
        scope: $scope,
        resolve: {
          item: function () {
            return $scope.currentItem;
          },
          list: function () {
            return [];
          },
          type: function () {
            return $scope.type;
          }
        }
      };
    }

    if ($scope.sortable) {
      $scope.sortableOptions = {
        axis: 'y',
        stop: function () {
          for (var index in $scope.items) {
            var item = $scope.items[index];
            if (item.sort !== index) {
              item.sort = index;
              $scope.updateIndex(item);
            }
          }
        }
      };
      /*
       * be carrefull... you might PUT incomplete objects here...
       */
      $scope.updateIndex = function (item) {
        $http.put($scope.apiRessourceUrl + '/' + item._id, item);
      };
    }

    /*
     * be carrefull... you might PUT incomplete objects here...
     */
    $scope.activateIndex = function (item) {
      item.active = !item.active;
      $http.put($scope.apiRessourceUrl + '/' + item._id, item);
    };

    $scope.deleteIndex = Modal.confirm.delete(function (item) {
      $http.delete($scope.apiRessourceUrl + '/' + item._id)
        .then(function () {
          $scope.reload();
        });
    });

    $scope.$on('$destroy', function () {
      //
    });

    $scope.editIndex = function (item) {
      $scope.currentItem = item;
      var $uibModalInstance = $uibModal.open(modalEditOpts);
      $uibModalInstance.onClose = function (cancel) {
        if (!cancel) $scope.reload();
      };
    };

    $scope.cloneIndex = function (item) {
      var copyItem = angular.copy(item);
      delete copyItem._id;
      if (copyItem.title) {
        copyItem.title = copyItem.title + '(clone)'
      }
      if (copyItem.name) {
        copyItem.name = copyItem.name + '(clone)'
      }
      if (copyItem.label) {
        copyItem.label = copyItem.label + '(clone)'
      }

      $http.post($scope.apiRessourceUrl + '/', copyItem).then(function (result) {
        $scope.reload();
      }, function (err) {
        $log.debug(err.statusText);
      });
    };

    $scope.newIndex = function (item) {
      var newIndex = item ? angular.copy(item) : {};
      delete newIndex.id;
      delete newIndex._id;
      $scope.currentItem = newIndex;
      var $uibModalInstance = $uibModal.open(modalNewOpts);
      $uibModalInstance.onClose = function (cancel) {
        if (!cancel) $scope.reload();
      };
    };

    $scope.importAlgolia = function () {
      $http.post($scope.apiRessourceUrl + '/algolia').then(function () {
        ngToast.create({
          content: 'Import algolia complet'
        });
      }, function (err) {
        ngToast.create({
          className: 'warning',
          content: 'API Error' + err.statusText
        });
        $log.debug(err.statusText);
      });
    };

    $scope.isEditable = function () {
      var isEdit = true;
      switch ($scope.type) {
        case'config':
          isEdit = false;
          break;
        default:
          break;
      }
      return isEdit;
    };

    $scope.hasThumb = function () {
      var hasTmb = true;
      switch ($scope.type) {
        case'notification':
        case'licensor':
        case'category':
        case'language':
        case'client':
        case'video':
        case'user':
        case'subscription':
        case'post':
        case'config':
        case'store':
        case'work':
        case'press':
          hasTmb = false;
          break;
        default:
          break;
      }
      return hasTmb;
    };

    $scope.isAlgoliaImportable = function () {
      var importable = false;
      //remove export to algolia (rabbitMQ does it automatically)
      //switch ($scope.type) {
      //case'season':
      //case'episode':
      //case'movie':
      //case'actor':
      //case'life/pin':
      //  importable = true;
      //  break;
      //default:
      //  break;
      //}
      return importable;
    };

    $scope.hasMail = function () {
      var hasTmb = false;
      switch ($scope.type) {
        case'user':
          hasTmb = true;
          break;
        default:
          break;
      }
      return hasTmb;
    }

  })
;
