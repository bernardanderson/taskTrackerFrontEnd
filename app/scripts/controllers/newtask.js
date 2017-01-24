'use strict';

/**
 * @ngdoc function
 * @name taskTrackerFrontEndApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the taskTrackerFrontEndApp
 */
angular.module('taskTrackerFrontEndApp')
  .controller('NewTaskCtrl', function ($scope) {

    $scope.printHello = function(){
      console.log("I think this will print hello");
    };


  });
