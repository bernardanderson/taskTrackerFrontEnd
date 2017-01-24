'use strict';

/**
 * @ngdoc overview
 * @name taskTrackerFrontEndApp
 * @description
 * # taskTrackerFrontEndApp
 *
 * Main module of the application.
 */
angular
  .module('taskTrackerFrontEndApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/newtask', {
        templateUrl: 'views/newtask.html',
        controller: 'NewTaskCtrl',
        controllerAs: 'newtask'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(false).hashPrefix('');
  });
