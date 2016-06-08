'use strict'

angular.module('schedulerApp', [])

.controller('scheduleController', ['$scope', 'scheduleFactory', function($scope, scheduleFactory){
	$scope.tab = 1;
	$scope.schedules = scheduleFactory;
	$scope.filtText = "Mon";

	$scope.select = function(setTab){
		$scope.tab = setTab;

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
	}

	$scope.isSelected = function(checkTab){
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


}])

