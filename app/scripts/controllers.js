'use strict'

angular.module('schedulerApp')

.controller('allController', ['$scope', 'scheduleService', 'controlService', function($scope, scheduleService, controlService){
	$scope.showForm = false;
	$scope.newClass = {
		name: "",
		instructor: "",
		time: "",
		day: {
			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false
		},
		location: ""
	}

	$scope.submit = function(){
		scheduleService.getSchedules(function(obj){

			var dayString = "";
			// var toSchedule = [];


			if(typeof obj.allClass === "undefined") {
				obj.allClass = [];
			}

			if(typeof obj.data === "undefined") {
				obj.data = [];
			}

			angular.forEach($scope.newClass.day, function(value, key) {
				if(value === true) {
					// scheduleService.getSchedules(function(newObj) {
					// 		var toSchedule = $scope.newClass;
					// 		toSchedule.day = key;
					// 		console.log($scope.newClass)
					// 		newObj.data.push(toSchedule);
					// 		chrome.storage.sync.set(newObj);
					// })
					// var tempClass = {};
					// tempClass = $scope.newClass;
					// tempClass.day = key;
					// toSchedule.push(tempClass);

					dayString = dayString + " " + key;
				}
			})

			$scope.newClass.day = dayString;

			obj.allClass.push($scope.newClass);
			// for(var item in toSchedule) {
				obj.data.push($scope.newClass.day.split(" "));
			// }
			chrome.storage.sync.set(obj);
				$scope.newClass = {
					name: "",
					instructor: "",
					time: "",
					day: {
						Mon: false,
						Tue: false,
						Wed: false,
						Thu: false,
						Fri: false
					},
					location: ""
				}
		})
		$scope.showForm = false;

	}

	$scope.show = function() {
		$scope.showForm = !$scope.showForm;
	}

	$scope.dshow = function() {
		controlService.dshow();
	}
}])

.controller('bodyController', ['$scope', 'scheduleService', 'controlService', function($scope, scheduleService, controlService) {
	
	$scope.schedules = [];
	$scope.showDelete = false;

	$scope.$watch(function() { return controlService.showDelete }, function(nVal, oVal) {
		$scope.showDelete = nVal;
	})

	$scope.delete = function(name) {
			scheduleService.getSchedules(function(obj) {
				var removed = obj.allClass.filter(function(item){
					return item.name !== name;
				})
				obj.allClass = removed;
				chrome.storage.sync.set(obj);
			})
	}

	scheduleService.getSchedules(function(obj){
			chrome.storage.sync.clear();
		if(typeof obj.allClass !== "undefined") {
			$scope.schedules = obj.allClass;
			$scope.$apply();
		}
	})


	chrome.storage.onChanged.addListener(function(changes, namespace) {
			console.log(changes.allClass.newValue)
			if(typeof changes.allClass.newValue !== "undefined") {
				$scope.schedules = changes.allClass.newValue;
				$scope.$apply();
			}
	})
}])

.controller('scheduleController', ['$scope', 'scheduleService', function($scope, scheduleService){
	$scope.tab = 1;
	$scope.filtText = "Mon";
	$scope.schedules = [];
	$scope.showForm = false;
	$scope.showDelete = false;

	$scope.dShow = function(){
		$scope.showDelete = !$scope.showDelete;
		if($scope.showDelete === true) {
			$scope.showForm = false;
		}
	}

	$scope.newClass = {
		day: "",
		instructor: "",
		location: "",
		name: "",
		time: ""
	}

	$scope.show = function(){
		$scope.showForm = !$scope.showForm;
		if($scope.showForm === true){
			$scope.showDelete = false;
		}
	}


	scheduleService.getSchedules(function(obj){
		// if(typeof obj.data !== "undefined") {
		// 		var days = obj.data.day.split(" ");
		// 		for(d in days) {
		// 			var temp = {};
		// 			angular.copy(changes.data.newValue, temp);
		// 			temp.day = days[d];
		// 			$scope.schedules.push(temp);

		// 		}
		// 		$scope.$apply();
		// 	}
		console.log(obj.data);
		$scope.schedules = obj.data;
		$scope.$apply();
		// console.log(obj);

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

		$scope.submit = function(day){
			scheduleService.getSchedules(function(obj) {
				$scope.newClass.day = day;
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

		$scope.delete = function(name){
			scheduleService.getSchedules(function(obj) {
				var removed = obj.data.filter(function(item){
					return item.name !== name;
				})
				obj.data = removed;
				chrome.storage.sync.set(obj);
			})
		}

		chrome.storage.onChanged.addListener(function(changes, namespace){
			if(typeof changes.data.newValue !== "undefined") {
				$scope.schedules = changes.data.newValue;
				$scope.$apply();
			}
		})


}])

