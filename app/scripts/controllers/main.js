'use strict';

/**
 * @ngdoc function
 * @name taskTrackerFrontEndApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the taskTrackerFrontEndApp
 */
angular.module('taskTrackerFrontEndApp')
  .controller('MainCtrl', function ($scope, $http) {
    
    $scope.taskData = [];

    $scope.convertTaskStatus = function(sentTaskStatusInt) {
      switch (sentTaskStatusInt) {
        case 0:
          return "To Do";
        case 1:
          return "In Progress";
        case 2:
          return "Completed";
        default:
          return "N/A";
      }
    }

    angular.element(document).ready(function () {
      $http.get('http://localhost:5000/userTasks')
      .then(data => $scope.taskData = data.data);
    });

    $scope.deleteItem = function(sentTask){
      $http.delete(`http://localhost:5000/userTasks/${sentTask.taskId}`).then(
        function(){
          $scope.taskData.splice($scope.taskData.indexOf(sentTask), 1);
        }
      )
    }

  });
