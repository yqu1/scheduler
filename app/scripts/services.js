'use strict'

angular.module('schedulerApp')
.service('scheduleService', function(){
	this.controls = {
		filtText: "Mon",
		showForm: false,
		showDelete: false,
		tab: 1
	}


	this.dShow = function(){
		this.controls.showDelete = !this.controls.showDelete;
		if(this.showDelete === true) {
			this.controls.showForm = false;
		}
	}

	this.show = function(){
		this.controls.showForm = !this.controls.showForm;
		if(this.showForm === true){
			this.controls.showDelete = false;
		}
	}

	this.select = function(setTab){
		this.controls.tab = setTab;
	}

	this.delete = function(name) {
				this.getSchedules(function(obj) {
				var removed = obj.data.filter(function(item){
					return item.name !== name;
				})
				obj.data = removed;
				chrome.storage.sync.set(obj);
			})
	}

	this.submit = function(day, newClass) {
			this.getSchedules(function(obj) {
				newClass.day = day;
				obj.data.push(newClass);
				chrome.storage.sync.set(obj);
			})

			this.controls.showForm = false;
	}

	this.isSelected = function(checkTab) {
			if(this.controls.tab === 1) {
				this.controls.filtText = "Mon";
			}
			if(this.controls.tab === 2) {
				this.controls.filtText = "Tue";
			}
			if(this.controls.tab === 3) {
				this.controls.filtText = "Wed";
			}
			if(this.controls.tab === 4) {
				this.controls.filtText = "Thu";
			}
			if(this.controls.tab === 5) {
				this.controls.filtText = "Fri";
			}
			return (this.controls.tab === checkTab);
	}

	this.selectNext = function(){
			if (this.controls.tab < 5) {
				this.controls.tab = this.controls.tab + 1;
			};

	}

	this.selectPrev = function() {
		if (this.controls.tab > 1) {
				this.controls.tab = this.controls.tab - 1;
		};
	}

	this.getSchedules = function(callback){
		chrome.storage.sync.get(function(obj){
			callback(obj);
		})
	}




})