// factory returning a promise over genre list.
angular.module('afrostreamAdminApp')
  .factory('Pf', function ($http) {
    return {
      getContents: function () {
        return $http.get('/api/pf/contents').then(function (result) {
          return result.data;
        })
      }
    };
  });
