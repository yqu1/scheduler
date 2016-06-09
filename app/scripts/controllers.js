'use strict'

angular.module('schedulerApp', [])

.controller('scheduleController', ['$scope', 'scheduleService', function($scope, scheduleService){
	$scope.tab = 1;
	$scope.filtText = "Mon";
	$scope.schedules = [];
	$scope.showForm = false;
	$scope.newClass = {
		day: "",
		instructor: "",
		location: "",
		name: "",
		time: ""
	}

	$scope.show = function(){
		$scope.showForm = true;
	}

	$scope.close = function(){
		$scope.showForm = false;
	}

	scheduleService.getSchedules(function(obj){
		$scope.schedules = obj.data;
		$scope.$apply();
		console.log(obj);

	})

			$scope.select = function(setTab){
			$scope.tab = setTab;
			console.log($scope.schedules);
		}

		$scope.isSelected = function(checkTab){
			if($scope.tab === 1) {
				$scope.filtText = "Mon";
			}
			if($scope.tab === 2) {
				$scope.filtText = "Tue";
			}
			if($scope.tab === 3) {
				$scope.filtText = "Wed";
			}
			if($scope.tab === 4) {
				$scope.filtText = "Thu";
			}
			if($scope.tab === 5) {
				$scope.filtText = "Fri";
			}
			return ($scope.tab === checkTab);
		}

		$scope.selectNext = function(){
			if ($scope.tab < 5) {
				$scope.tab = $scope.tab + 1;
			};
		}

		$scope.selectPrev = function(){
			if ($scope.tab > 1) {
				$scope.tab = $scope.tab - 1;
			};
		}

		$scope.submit = function(){
			scheduleService.getSchedules(function(obj) {
				obj.data.push($scope.newClass);
				chrome.storage.sync.set(obj);
					$scope.newClass = {
						day: "",
						instructor: "",
						location: "",
						name: "",
						time: ""
					}
			})

			$scope.showForm = false;
			
		}

		chrome.storage.onChanged.addListener(function(changes, namespace){
			console.log(changes);
			$scope.schedules = changes.data.newValue;
			$scope.$apply();

		})


}])

