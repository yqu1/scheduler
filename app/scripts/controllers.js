'use strict'

function compare(a, b) {
		var date1 = Date.parse('20 Aug 2000 ' + a.time.start);
		var date2 = Date.parse('20 Aug 2000 ' + b.time.start);
		return date1 > date2;
}

angular.module('schedulerApp')

.controller('allController', ['$scope', 'scheduleService', 'controlService', function($scope, scheduleService, controlService){

	$scope.showForm = false;


	$scope.newClass = {
		name: "",
		instructor: "",
		time: {
			start: "0:00 AM",
			end: "0:00 AM"
		},
		day: {
			Mon: false,
			Tue: false,
			Wed: false,
			Thu: false,
			Fri: false
		},
		location: ""
	}

	$('#start').timepicker();
	$('#end').timepicker();

	$scope.$watch(function() { return controlService.showForm }, function(nVal, oVal) {
		$scope.showForm = nVal;
	})

	$scope.submit = function(){

		var isConflict = false;
		var conflictClass = "";
		scheduleService.getSchedules(function(obj){

			var dayString = "";

			if(typeof obj.data === "undefined") {
				obj.data = [];
			}

			angular.forEach($scope.newClass.day, function(value, key) {

				if(value === true) {
					var filtered = obj.data.filter(function(val) {
						return val.day.indexOf(key) !== -1;
					})

					filtered.map(function(obj){
						var s1 = Date.parse('20 Aug 2000 ' + obj.time.start);
						var e1 = Date.parse('20 Aug 2000 ' + obj.time.end);
						var s2 = Date.parse('20 Aug 2000 ' + $scope.newClass.time.start);
						var e2 = Date.parse('20 Aug 2000 ' + $scope.newClass.time.end);
						if(s1 < e2 && e1 > s2) {
							isConflict = true;
							
							conflictClass += " " + obj.name;
						}
					})

					dayString = dayString + " " + key;
				}
			})


			if(isConflict) {
				$("#alert").append('<div class="alert alert-warning" role="alert">This class is in conflict with' + conflictClass +'</div>')
				setTimeout(function() {$(".alert").alert('close');}, 10000)
				console.log("Class in conflict with" + conflictClass);
				return;
			}

			$scope.newClass.day = dayString;

			obj.data.push($scope.newClass);
			chrome.storage.sync.set(obj);
				$scope.newClass = {
					name: "",
					instructor: "",
					time: {
						start: "0:00 AM",
						end: "0:00 AM"
					},
								day: {
									Mon: false,
									Tue: false,
									Wed: false,
									Thu: false,
									Fri: false
								},
								location: ""
				}
			$scope.showForm = false;
		})
		

	}

	$scope.show = function() {
		controlService.showForm = !controlService.showForm;
	}

	$scope.dshow = function() {
		controlService.dshow();
	}		
}])

.controller('bodyController', ['$scope', 'scheduleService', 'controlService', 'ratingService', function($scope, scheduleService, controlService, ratingService) {

	$scope.schedules = [];
	$scope.showDelete = false;

	$scope.showRating = false;
	var schoolname;

	$('.tooltip-demo.well').tooltip({
  			selector: "a[rel=tooltip]"
	})

	$scope.hide = function(){
		controlService.showDelete = false;
		controlService.showForm = false;
	}



	 function getRating(name, completed, schoolName, callback) {
	 	completed.count += 1;
	 	var rmpsearch = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=UNIVERSITY&queryoption=HEADER&query=PROFESSORNAME&facetSearch=true';
		 var URLprofessorName = name.replace(/ /g,'+').replace(/,/g,'');
		 var URLschoolName = schoolName.replace(/ /g,'+').replace(/,/g,'');
		 rmpsearch = rmpsearch.replace('PROFESSORNAME',URLprofessorName).replace('UNIVERSITY', URLschoolName);
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
		            rating.infoURL = professorPageURL;

		           	callback(rating, name);
		    		

		    	}


		    	catch(err) {
		    		callback(null, name);
		    	}
		 	})
		 });
	}

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
			schoolname = obj.schoolname;
		if(typeof obj.data !== "undefined") {
			var rating = {
	    		overall: "Not available",
	    		takeAgain: "Not available",
	    		difficulty: "Not available",
	    		infoURL: "http://www.ratemyprofessors.com/"
	    	};
			$scope.schedules = obj.data.sort(compare);
			var completed = {count: 0};

			for(var i = 0; i < $scope.schedules.length; i++) {
				getRating($scope.schedules[completed.count].instructor, completed, obj.schoolname, function(val, name) {
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


	chrome.storage.onChanged.addListener(function(changes, namespace) {
			console.log(changes.data.newValue)
			if(typeof changes.data.newValue !== "undefined") {
							var rating = {
					    		overall: "Not available",
					    		takeAgain: "Not available",
					    		difficulty: "Not available",
					    		infoURL: "http://www.ratemyprofessors.com/"
					    	};
				$scope.schedules = changes.data.newValue.sort(compare);
				console.log(changes);
				var completed = {count: 0};

				for(var i = 0; i < $scope.schedules.length; i++) {
					console.log($scope.schedules[i])
					getRating($scope.schedules[completed.count].instructor, completed, schoolname, function(val, name) {
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

		obj.data = obj.data.sort(compare);

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

.controller('mainController', ['$scope', 'scheduleService', '$location', function($scope, scheduleService, $location){
	$scope.schoolname = "";



	scheduleService.getSchedules(function(obj){
		if(typeof obj.schoolname !== undefined){
			$scope.schoolname = obj.schoolname;
			$scope.$apply()
		}
	})

	$scope.submit = function(){

		scheduleService.getSchedules(function(obj){
			obj.schoolname = $scope.schoolname;
			chrome.storage.sync.set(obj);
		})

		$location.path('/allschedule');

	}
}])

