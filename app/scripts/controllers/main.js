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

    $scope.taskSearchFilter = {
      searchString: "",
      filterSelection: "name"
    }

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

    $scope.filterTasks = function(sentUserInput) {
      return function(sentTask) { 
        switch ($scope.taskSearchFilter.filterSelection) {
          case "name":
            return sentTask.name.toLowerCase().match(sentUserInput.toLowerCase());
          case "description":
            return sentTask.description.toLowerCase().match(sentUserInput.toLowerCase());
          case "status":
            return $scope.convertTaskStatus(sentTask.taskStatus).toLowerCase().match(sentUserInput.toLowerCase());  
          case "completeddate":
            if (sentUserInput !== "" && sentTask.taskStatus !== 2) {
              return false;
            }
            return sentTask.completedOn.toLowerCase().match(sentUserInput.toLowerCase());  
          default:
            return true; 
        }
      }
    };

    $scope.fireDropDown = function(sentTask) {
      if ($scope.editingMode.hasFiredOnce){
        angular.element('.ui.inline.dropdown').dropdown({
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
        angular.element(`.searcher.dropdown`).addClass("disabled");
        angular.element(`input.searcher`).attr("disabled", "true");
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
          angular.element(`.searcher.dropdown`).removeClass("disabled");
          angular.element(`input.searcher`).removeAttr("disabled");
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
      .then( data => $scope.taskData = data.data );
        
      angular.element('.searcher.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {
          $scope.taskSearchFilter.filterSelection = value;
        }
      });
    });

    $scope.deleteItem = function(sentTask){
      $http.delete(`http://localhost:5000/userTasks/${sentTask.taskId}`).then(
        function(){
          $scope.taskData.splice($scope.taskData.indexOf(sentTask), 1);
        }
      )
    }

  });
