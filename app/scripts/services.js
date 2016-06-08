'use strict'

angular.module('schedulerApp')
.factory('scheduleFactory', function(){

	var schedules = [
			{
				day:"Mon",
				name: "math",
				time: "3:00 - 4:00",
				instructor: "Qu Yaoxian",
				location: "your mom's vagina"
			},
			{
				day:"Mon",
				name: "CS",
				time: "5:00 - 6:00",
				instructor: "Qu Yaoxian",
				location: "your mom's vagina"
			},

			{
				day:"Tue",
				name: "CS",
				time: "3:00 - 4:00",
				instructor: "Qu Yaoxian",
				location: "toilet"
			},
			{
				day:"Tue",
				name: "math",
				time: "5:00 - 6:00",
				instructor: "Qu Yaoxian",
				location: "your mom's vagina"
			},
			{
				day:"Mon",
				name: "CS",
				time: "5:00 - 6:00",
				instructor: "Qu Yaoxian",
				location: "your mom's vagina"
			},
			{
				day:"Mon",
				name: "CS",
				time: "5:00 - 6:00",
				instructor: "Qu Yaoxian",
				location: "your mom's vagina"
			}
	]

	return schedules;

})