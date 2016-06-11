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

			obj.data.push($scope.newClass);
			// for(var item in toSchedule) {
				// obj.data.push($scope.newClass.day.split(" "));
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
				var removed = obj.data.filter(function(item){
					return item.name !== name;
				})
				obj.data = removed;
				chrome.storage.sync.set(obj);
			})
	}

	scheduleService.getSchedules(function(obj){
			// chrome.storage.sync.clear();
		if(typeof obj.data !== "undefined") {
			$scope.schedules = obj.data;
			$scope.$apply();
		}
	})


	chrome.storage.onChanged.addListener(function(changes, namespace) {
			console.log(changes.data.newValue)
			if(typeof changes.data.newValue !== "undefined") {
				$scope.schedules = changes.data.newValue;
				$scope.$apply();
			}
	})
}])

.controller('scheduleController', ['$scope', 'scheduleService', function($scope, scheduleService){
	$scope.tab = 1;
	$scope.filtText = "Mon";
	$scope.schedules = [];




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
		for(var item in obj.data) {
			obj.data[item].day = obj.data[item].day.split(" ");
			for(var day in obj.data[item].day) {
				var temp = {};
				angular.copy(obj.data[item], temp);
				temp.day = obj.data[item].day[day];
				$scope.schedules.push(temp);
			}
		}
		console.log(obj.data);

		// $scope.schedules = obj.data;
		// $scope.$apply();
		// console.log(obj);
		$scope.$apply();

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



}])

