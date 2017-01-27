'use strict';

/**
 * @ngdoc function
 * @name taskTrackerFrontEndApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the taskTrackerFrontEndApp
 */
angular.module('taskTrackerFrontEndApp')
  .controller('NewTaskCtrl', function ($scope, $http) {

    $scope.formData = {
      TaskId: 0,
      Name: "",
      Description: "",
      TaskStatus: 0,
    };

    $scope.getFormData = function(){

      if ($scope.formData.Name === "") {
        $('div.field.name').addClass("error");
      } else {
        $('div.field.name').removeClass("error");
      }

      if ($scope.formData.Description === "") {
        $('div.field.description').addClass("error");
      } else {
        $('div.field.description').removeClass("error");
      }

      if ($('div.field.description').hasClass("error") || $('div.field.name').hasClass("error")){
        return;
      }

      $http({
        method: 'POST',
        url: 'http://localhost:5000/userTasks',
        headers: { 'Content-Type': 'application/json' },
        data: angular.toJson($scope.formData)
        })
    };

    angular.element(document).ready(function () {
      $('.ui.checkbox').checkbox().first().checkbox("set checked");
      $('.ui.checkbox').checkbox({
        onChecked: function() {
          $scope.formData.TaskStatus = parseInt($(this).val());
        }
      });

    });


  });
