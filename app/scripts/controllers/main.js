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

    $scope.editedTask = {}

    $scope.editingMode = {
      enabled: false,      
      task: null,
      hasFiredOnce: false
    }

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

    $scope.fireDropDown = function(sentTask) {
      if ($scope.editingMode.hasFiredOnce){
        angular.element('.ui.dropdown').dropdown({
          onChange: function(value, text, $selectedItem) {
            for (let i = 0; i < $scope.taskData.length; i++) {
              if ($scope.taskData[i].taskId === sentTask.taskId) {
                $scope.taskData[i].taskStatus = parseInt(value);
                angular.element(`.task_${sentTask.taskId}.dropd`).text($scope.convertTaskStatus(parseInt(value)));
                return;
              }
            }
          }
        });
      }
    }

    $scope.editItem = function(sentTask) {
      $scope.editingMode.enabled = !$scope.editingMode.enabled;
      $scope.editingMode.hasFiredOnce = true;

      if ($scope.editingMode.enabled) {
        $scope.editingMode.task = sentTask.taskId;
        $scope.fireDropDown(sentTask);
        angular.element(`.task_${sentTask.taskId}`).attr("contenteditable", "true");
        angular.element(`.task_${sentTask.taskId}`).addClass("warning");
      } else {
        let name = angular.element(`.task_${sentTask.taskId}.name`);
        let desc = angular.element(`.task_${sentTask.taskId}.desc`);
        
        if (name.text() === "") {
          name.removeClass("warning")
          name.addClass("error");
          $scope.editingMode.enabled = true;
        } else {
          name.removeClass("error");
        }

        if (desc.text() === "") {
          desc.removeClass("warning")
          desc.addClass("error");
          $scope.editingMode.enabled = true;
        } else {
          desc.removeClass("error");
        }

        if (name.text() !== "" && desc.text() !== "") {
          $scope.editingMode.task = null;
          angular.element(`.task_${sentTask.taskId}`).removeAttr("contenteditable");
          angular.element(`.task_${sentTask.taskId}`).removeClass("warning");
          $scope.editTask(sentTask);
        }
      }
    }

    $scope.editTask = function(sentTask) {
      for (let i = 0; i < $scope.taskData.length; i++) {
        if ($scope.taskData[i].taskId === sentTask.taskId) {
          $scope.taskData[i].name = angular.element(`.task_${sentTask.taskId}.name`).text();
          $scope.taskData[i].description = angular.element(`.task_${sentTask.taskId}.desc`).text();
          $scope.putItem($scope.taskData[i]);
          break;
        }
      }
    }

    $scope.putItem = function(sentTask) {
      $http({
        method: 'PUT',
        url: `http://localhost:5000/userTasks/${sentTask.taskId}`,
        headers: { 'Content-Type': 'application/json' },
        data: angular.toJson(sentTask)
        })
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
