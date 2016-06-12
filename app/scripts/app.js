'use strict';

angular.module('schedulerApp', ['ui.router', 'ngDialog', 'ngResource'])
.config(function($httpProvider) {
	$httpProvider.useApplyAsync(true);
})
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('app', {
			url: '/',
			views: {
				'header': {
					templateUrl: 'views/header.html',
					controller: 'allController'
				},
				'content': {
					templateUrl: 'views/schedule.html',
					controller: 'bodyController'
				}
			}
		})

		.state('app.weekschedule', {
			url: 'weekschedule',
			views: {
				'header@': {
					templateUrl: 'views/weekheader.html'
				},
				'content@': {
					templateUrl: 'views/weekschedule.html',
					controller: 'scheduleController'
				}
			}
		})

	$urlRouterProvider.otherwise('/');
})