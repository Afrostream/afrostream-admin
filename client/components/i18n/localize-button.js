'use strict';

angular.module('afrostreamAdminApp')
  .controller('LocalizeDialogController', function ($scope, $filter, $log, $uibModalInstance, Lang) {
    Lang.query({}).$promise.then(function (langs) {
      $scope.langList = langs
    });
    //$scope.tag = tag;
    //$scope.key = key;
    //$scope.item = item;
    $scope.item = $scope.ngModel();
    $scope.removeDefaultLocale = function (lang) {
      return lang.lang !== 'fr';
    };
    //$scope.$watch('item.translations', function (json) {
    //  $scope.jsonString = $filter('json')(json);
    //}, true);
    //
    //$scope.$watch('jsonString', function (json) {
    //  try {
    //    $scope.item.translations = JSON.parse(json);
    //    $scope.wellFormed = true;
    //  } catch (e) {
    //    $scope.wellFormed = false;
    //  }
    //}, true);

    $scope.close = function () {
      $uibModalInstance.close();
    };
  })
  .directive('localizeInput', function ($compile) {
    return {
      restrict: 'E',
      template: '',
      transclude: true,
      scope: {
        ngModel: '=',
        ngTag: '@',
        ngKey: '@',
        ngLang: '@',
        className: '@'
      },
      link: function ($scope, element, attributes, ngModel, ngTag, ngKey, ngLang) {
        $scope.tag = attributes.ngTag;
        $scope.$watch('tag', function (html) {
          var htmlTag = `<${html} class="form-control ${html}" ta-unsafe-sanitizer="true" ng-model="ngModel[ngKey][ngLang]"/>`;
          element.html(htmlTag);
          $compile(element.contents())($scope);
        });
      }
    }
  })
  .directive('localizeButton', function ($uibModal) {
    return {
      restrict: 'E',
      template: '<button type="button" class="btn btn-xs btn-primary" ng-click="openI18nModal()" >translate</button>',
      transclude: true,
      scope: {
        ngModel: '&',
        ngKey: '=',
        ngTag: '=?'

      },
      link: function ($scope, element, attributes, ngModel, ngTag, ngKey) {

        $scope.tag = attributes.ngTag || 'input';
        $scope.key = attributes.ngKey;

        var modalOpts = {
          templateUrl: 'components/i18n/localize.html', // Url du template HTML
          controller: 'LocalizeDialogController',
          size: 'lg',
          scope: $scope,
          resolve: {
            //item: function () {
            //  return $scope.ngModel
            //},
            //tag: function () {
            //  return $scope.tag
            //},
            //key: function () {
            //  return $scope.key
            //}
          }
        };


        $scope.openI18nModal = function () {
          var $uibModalInstance = $uibModal.open(modalOpts);
          $uibModalInstance.onClose = function (cancel) {
            if (!cancel) $scope.reload();
          };
        }
      }
    }
  });
