'use strict'

angular.module('schedulerApp')
.service('scheduleService', function(){


	this.getSchedules = function(callback){
		chrome.storage.sync.get(function(obj){
			callback(obj);
		})
	}


})

.service('controlService', function() {
	this.showDelete = false;
	this.dshow = function() {
		this.showDelete = !this.showDelete;
	}
})

.service('ratingService', ['$http', function($http) {
	this.getProfessorExtension = function(searchPageURL, professorName, callback){

	    $http.get(searchPageURL).then(function(response) {
	    	callback(response.data)
	    });

	}

	this.findRatings = function(professorPageURL, professorName, callback) {

	    $http.get(professorPageURL).then(function(response) {
	    	callback(response.data);

	    })

	}



}])