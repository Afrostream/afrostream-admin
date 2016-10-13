'use strict';

angular.module('afrostreamAdminApp')
  .factory('LifeTheme', function ($resource) {
    return $resource('/api/life/themes/:id/:controller', {
        id: '@_id'
      },
      {
        get: {
          method: 'GET',
          params: {
            id: '0'
          }
        }
      });
  })
  .factory('LifePin', function ($resource) {
    return $resource('/api/life/pins/:id/:controller', {
        id: '@_id'
      },
      {
        get: {
          method: 'GET',
          params: {
            id: '0'
          }
        }
      });
  });
