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