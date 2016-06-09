'use strict';

angular.module('schedulerApp', ['ui.router', 'ngDialog', 'ngResource'])
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
			url: '/',
			views: {
				'header': {
					templateUrl: 'views/header.html',
				},
				'content': {
					templateUrl: 'views/schedule.html',
				}
			}
		})

		.state('app.weekschedule', {
			url: 'weekschedule',
			views: {
				'content@': {
					templateUrl: 'views/weekschedule.html',
					controller: 'scheduleController'
				}
			}
		})

	$urlRouterProvider.otherwise('/');
})