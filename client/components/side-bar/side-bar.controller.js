'use strict';

angular.module('afrostreamAdminApp')
  .controller('SidebarCtrl', function ($scope, Auth) {
    $scope.menu = [{
      'title': 'Dashboard',
      'state': 'main',
      'icon': 'fa-tachometer'
    }, {
      'title': 'Mailer',
      'state': 'mailer',
      'icon': 'fa-envelope'
    }, {
      'title': 'PF',
      'state': 'pf',
      'icon': 'fa-cogs'
    }, {
      'title': 'Categorys',
      'state': 'categorys',
      'icon': 'fa-bookmark'
    }, {
      'title': 'Carousel',
      'state': 'carousel',
      'icon': 'fa-hand-spock-o'
    }, {
      'title': 'Catchup',
      'state': 'catchup',
      'icon': 'fa-tv'
    }, {
      'title': 'Licensors',
      'state': 'licensors',
      'icon': 'fa-trophy'
    }, {
      'title': 'Movies',
      'state': 'movies',
      'icon': 'fa-video-camera'
    }, {
      'title': 'Seasons',
      'state': 'seasons',
      'icon': 'fa-film'
    }, {
      'title': 'Episodes',
      'state': 'episodes',
      'icon': 'fa-ticket'
    }, {
      'title': 'Videos',
      'state': 'videos',
      'icon': 'fa-file-video-o'
    }, {
      'title': 'Languages',
      'state': 'languages',
      'icon': 'fa-globe'
    }, {
      'title': 'Images',
      'state': 'images',
      'icon': 'fa-picture-o'
    }, {
      'title': 'Actors',
      'state': 'actors',
      'icon': 'fa-female'
    }, {
      'title': 'Users',
      'state': 'users',
      'icon': 'fa-users'
    }, {
      'title': 'Users Logs',
      'state': 'users-logs',
      'icon': 'fa-users'
    }, {
      'title': 'Clients',
      'state': 'clients',
      'icon': 'fa-user-secret'
    }, {
      'title': 'Jobs',
      'state': 'jobs',
      'icon': 'fa-clock-o'
    }, {
      'title': 'Stores',
      'state': 'stores',
      'icon': 'fa-street-view'
    }, {
      'title': 'Notifications',
      'state': 'notifications',
      'icon': 'fa-bell'
    }, {
      'title': 'Imports',
      'state': 'imports',
      'icon': 'fa-download'
    }, {
      'title': 'Configs',
      'state': 'configs',
      'icon': 'fa-cogs'
    }, {
      'title': 'Life',
      'state': 'life',
      'icon': 'fa-user'
    }, {
      'title': 'Widgets',
      'state': 'widgets',
      'icon': 'fa-code'
    }, {
      'title': 'Works',
      'state': 'works',
      'icon': 'fa-building-o'
    }, {
      'title': 'Press',
      'state': 'press',
      'icon': 'fa-newspaper-o'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
  });
