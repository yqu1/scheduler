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

			if(typeof obj.data === "undefined") {
				obj.data = [];
			}

			angular.forEach($scope.newClass.day, function(value, key) {
				if(value === true) {

					dayString = dayString + " " + key;
				}
			})

			$scope.newClass.day = dayString;

			obj.data.push($scope.newClass);
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

.controller('bodyController', ['$scope', 'scheduleService', 'controlService', 'ratingService', function($scope, scheduleService, controlService, ratingService) {
	
	$scope.schedules = [];
	$scope.showDelete = false;

	$scope.showRating = false




	 function getRating(name, completed, callback) {
	 	completed.count += 1;
	 	var rmpsearch = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=college+of+william+and+mary&queryoption=HEADER&query=PROFESSORNAME&facetSearch=true';
		 var URLprofessorName = name.replace(/ /g,'+').replace(/,/g,'');
		 rmpsearch = rmpsearch.replace('PROFESSORNAME',URLprofessorName);
		 ratingService.getProfessorExtension(rmpsearch, name, function(data) {
		 	var responseXML, ratings;

		 	try {
		 		responseXML = data;
		 		var professorURLExtension = $(responseXML).find('.listing:first').find('a:first').attr('href');
		 	}

		 	catch(err) {
		 		console.log(err);
		 		var professorURLExtension = null;
		 	}

		 	if(typeof professorURLExtension === "undefined") {
		 		callback(null, name);
		 		return;
		 	}

		 	// console.log(professorURLExtension);

		 	var professorPageURL = 'http://www.ratemyprofessors.com' + professorURLExtension;

		 	ratingService.findRatings(professorPageURL, name, function(res) {
		 		var rating = {
		    		overall: -1,
		    		takeAgain: -1,
		    		difficulty: -1,

		    	}

		    	var responseXML;

		    	try {
		    		responseXML = res;

		    		rating.overall = $(responseXML).find('.breakdown-header:eq(0)').find('.grade').html().replace(/\s/g, "");
		            rating.takeAgain = $(responseXML).find('.breakdown-header:eq(1)').find('.grade:eq(0)').html().replace(/\s/g, "");
		            rating.difficulty = $(responseXML).find('.breakdown-header:eq(1)').find('.grade:eq(1)').html().replace(/\s/g, "");


		           	callback(rating, name);
		    		

		    	}


		    	catch(err) {
		    		callback(null, name);
		    	}
		 	})
		 });
	}

	 // $scope.getRating = function(professorName) {

	 // 	var rating = ratingService.getProfessorRating(professorName);

	 // 	if(typeof rating !== 'undefined') {
	 // 		console.log(rating);
	 // 		$scope.rating = rating;
	 // 		$scope.showRating = true;
	 // 	}


	 // }

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
			var rating = {
	    		overall: "Not available",
	    		takeAgain: "Not available",
	    		difficulty: "Not available"
	    	};
			$scope.schedules = obj.data;
			var completed = {count: 0};

			for(var i = 0; i < $scope.schedules.length; i++) {
				console.log($scope.schedules[i])
				getRating($scope.schedules[completed.count].instructor, completed, function(val, name) {
					console.log(name);
					if(val === null) {
						for(var item in $scope.schedules) {
							if($scope.schedules[item].instructor === name) {
									$scope.schedules[item].rating = rating;
								}
						}
					}
					else {
						for(var item in $scope.schedules) {
							if($scope.schedules[item].instructor === name) {
									$scope.schedules[item].rating = val;
								}
						}
					}
				})
			}

			// for(var item in $scope.schedules){
			// 	getRating($scope.schedules[item].instructor,function(val) {
			// 		console.log(val);
			// 						console.log($scope.schedules[item]);
			// 		if(typeof val === 'undefined') {
			// 			$scope.schedules[item].rating = rating;
			// 		}
			// 		else {
			// 			$scope.schedules[item].rating = val;
			// 		}
			// 		completed++;
			// 		// if(completed === $scope.schedules.length - 1) {
			// 		// 		$scope.$apply();
			// 		// 	}
			// 				// $scope.$applyAsync();
			// 	})


			// }

			$scope.$apply();
		}
	})


	chrome.storage.onChanged.addListener(function(changes, namespace) {
			console.log(changes.data.newValue)
			if(typeof changes.data.newValue !== "undefined") {
							var rating = {
					    		overall: "Not available",
					    		takeAgain: "Not available",
					    		difficulty: "Not available"
					    	};
				$scope.schedules = changes.data.newValue;
				var completed = {count: 0};

				for(var i = 0; i < $scope.schedules.length; i++) {
					console.log($scope.schedules[i])
					getRating($scope.schedules[completed.count].instructor, completed, function(val, name) {
						console.log(name);
						if(val === null) {
							for(var item in $scope.schedules) {
								if($scope.schedules[item].instructor === name) {
										$scope.schedules[item].rating = rating;
									}
							}
						}
						else {
							for(var item in $scope.schedules) {
								if($scope.schedules[item].instructor === name) {
										$scope.schedules[item].rating = val;
									}
							}
						}
					})
				}
				$scope.$apply();
			}
	})
}])

.controller('scheduleController', ['$scope', 'scheduleService', function($scope, scheduleService){
	$scope.tab = 1;
	$scope.filtText = "Mon";
	$scope.schedules = [];




	scheduleService.getSchedules(function(obj){

		for(var item in obj.data) {
			obj.data[item].day = obj.data[item].day.split(" ");
			for(var day in obj.data[item].day) {
				var temp = {};
				angular.copy(obj.data[item], temp);
				temp.day = obj.data[item].day[day];
				$scope.schedules.push(temp);
			}
		}
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

