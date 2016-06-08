'use strict'

angular.module('schedulerApp', [])

.controller('pageController', ['$scope', function($scope){
	$scope.tab = 1;

	$scope.select = function(setTab){
		$scope.tab = setTab;
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