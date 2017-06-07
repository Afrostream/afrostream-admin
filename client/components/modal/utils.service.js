angular.module('afrostreamAdminApp')
       .factory('ModalUtils', function ($http, $log, ngToast) {
         // BEGIN temporary fix on dates...
         // should be generic & added to $httpProvider
         function parseItemDates(item) {
           if (item.dateReleased) {
             item.dateReleased = new Date(item.dateReleased);
           }
           return item;
         }

         // FIXME: should not be here & be generic...
         var getTitle = function (item) {
           return item.title || item.label || item.name || item.target || ((item.firstName || item.lastName) ? item.firstName + ' ' + item.lastName : '' );
         };

         var onError = function (err) {
           ngToast.create({
             className: 'warning',
             content: 'API Error'
           });
           $log.debug(err);
         }

         // FIXME:
         // add asserts on required $scope members
         var ModalUtils = {
           /*
            * /!\ this function mutate $scope parameter...
            *  adding:
            *    $scope.item, $scope.directiveType
            */
           createHandlerGetItem: function ($scope, item) {
             return function () {
               $scope.directiveType = $scope.modalType + 's';

               if (!item || !item._id) {
                 // FIXME: ... est-ce le cas ou l'on est en création ???
                 $scope.item = item; // on tente un hotfix..
                 return;
               }
               return $http.get('/api/' + $scope.directiveType + '/' + item._id, {params: {backo: 1}}).then(function (result) {
                 // FIXME: network code inside modal/* data/* should be in a single place
                 //  & user $httpProvider to filter dates..
                 var item = result.data;
                 if (typeof $scope.modalHooks.hydrateItem === 'function') {
                   item = $scope.modalHooks.hydrateItem(item);
                 }
                 $scope.item = parseItemDates(item);

                 // fixme: horrible...
                 if (typeof $scope.modalHooks.onItemLoaded === 'function') {
                   $scope.modalHooks.onItemLoaded();
                 }
               }, onError);
             };
           },

           /*
            * will use :
            *   $scope.modalHooks.beforeAdd & afterAdd
            */
           createHandlerAddItem : function (options) {
             var $scope = options.$scope;
             var close = options.close;

             return function () {
               if (typeof $scope.modalHooks.beforeAdd === 'function') {
                 $scope.modalHooks.beforeAdd();
               }
               return $http.post('/api/' + $scope.directiveType, $scope.item).then(function (result) {
                 ngToast.create({
                   content: 'L\'objet ' + $scope.modalType + ' ' + getTitle(result.data) + ' à été ajoutée au catalogue'
                 });
                 if (typeof $scope.modalHooks.afterAdd === 'function') {
                   $scope.modalHooks.afterAdd(result.data);
                 }
                 close();
               }, onError);
             }
           },

           createHandlerUpdateItem : function (options) {
             var $scope = options.$scope;
             var close = options.close;

             return function () {
               if (typeof $scope.modalHooks.beforeUpdate === 'function') {
                 $scope.modalHooks.beforeUpdate();
               }
               $http.put('/api/' + $scope.directiveType + '/' + $scope.item._id, $scope.item).then(function (result) {
                 ngToast.create({
                   content: 'L\'objet  ' + $scope.modalType + ' ' + getTitle(result.data) + ' à été mise a jour'
                 });
                 if (typeof $scope.modalHooks.afterUpdate === 'function') {
                   $scope.modalHooks.afterUpdate(result.data);
                 }
                 close();
               }, onError);
             };
           },

           createHandlerDeleteItem : function (options) {
             var $scope = options.$scope;
             var close = options.close;

             return function () {
               $http.delete('/api/' + $scope.directiveType + '/' + $scope.item._id).then(function (result) {
                 ngToast.create({
                   content: 'L\'objet  ' + $scope.modalType + ' ' + getTitle(result.data) + ' à été supprimée du catalogue'
                 });
                 close();
               }, onError);
             }
           }
         };
         return ModalUtils;
       });
