'use strict';

angular.module('schedulerApp')

.controller('scheduleController', ['$scope', 'scheduleService', function($scope, scheduleService){
	$scope.tab = 1;
	$scope.filtText = scheduleService.controls.filtText;
	$scope.schedules = [];
	$scope.showForm = scheduleService.controls.showForm;
	$scope.showDelete = scheduleService.controls.showDelete;
	$scope.newClass = {
						day: "",
						instructor: "",
						location: "",
						name: "",
						time: ""
		}

		scheduleService.getSchedules(function(obj) {
			$scope.schedules = obj.data;
			$scope.$apply();
			console.log(obj.data);
		})

	$scope.$watch(function(){ return scheduleService.controls}, function(nVal, oVal) {
		if(typeof nVal !== 'undefined') {
			$scope.showDelete = scheduleService.controls.showDelete;
			$scope.showForm = scheduleService.controls.showForm;
			$scope.filtText = scheduleService.controls.filtText;
			$scope.filtText = scheduleService.controls.tab;
		}
	}, true);

	// $scope.$watch(function(){ return scheduleService.controls.newClass}, function(nVal, oVal) {
	// 	if(typeof nVal !== 'undefined') {
	// 		$scope.showDelete = scheduleService.controls.newClass;
	// 	}
	// })

	// $scope.$watch(function(){ return scheduleService.controls.showDelete}, function(nVal, oVal) {
	// 	if(typeof nVal !== 'undefined') {
	// 		$scope.showDelete = scheduleService.controls.showDelete;
	// 	}
	// })

	// $scope.$watch(function(){ return scheduleService.controls.showForm}, function(nVal, oVal) {
	// 	if(typeof nVal !== 'undefined') {
	// 		$scope.showForm = scheduleService.controls.showForm;
	// 	}
	// })

	// $scope.$watch(function(){ return scheduleService.controls.filtText}, function(nVal, oVal) {
	// 	if(typeof nVal !== 'undefined') {
	// 		$scope.filtText = scheduleService.controls.filtText;
	// 	}
	// })

	// $scope.$watch(function(){ return scheduleService.controls.tab}, function(nVal, oVal) {
	// 	if(typeof nVal !== 'undefined') {
	// 		$scope.filtText = scheduleService.controls.tab;
	// 	}
	// })

	// $scope.$watch(function(){ return scheduleService.controls.schedules}, function(nVal, oVal) {
	// 	if(typeof nVal !== 'undefined') {
	// 		$scope.schedules = scheduleService.controls.schedules;
	// 	}
	// })

	$scope.dShow = function(){
		scheduleService.dShow();
	}

	$scope.show = function(){
		scheduleService.show();
	}

		$scope.select = function(setTab){
			scheduleService.select(setTab);
		}

		$scope.isSelected = function(checkTab){
			return scheduleService.isSelected(checkTab);
		}

		$scope.selectNext = function(){
			scheduleService.selectNext();
		}

		$scope.selectPrev = function(){
			scheduleService.selectPrev();
		}

		$scope.submit = function(day){

			scheduleService.submit(day, $scope.newClass);
			$scope.newClass = {
						day: "",
						instructor: "",
						location: "",
						name: "",
						time: ""
			}
		}

		$scope.delete = function(name) {
			scheduleService.delete(name);
		}


		// 	chrome.storage.onChanged.addListener(function(changes, namespace){
		// 	console.log(changes);
		// 	$scope.schedules = changes.data.newValue;
		// 	$scope.$apply();

		// })
		chrome.storage.onChanged.addListener(function(changes, namespace){
			console.log(changes);
			$scope.schedules = changes.data.newValue;
			$scope.$apply();

		})


}])

