# scheduler

Usage: 

Clone the code and include the directory directly through chrome/window/extension/load extensions


structure:

-scheduler_plugin

	-app

	-scheduler.html -- index page

	-images
		-icon.png -- icon shown on chrome extension

	-scripts
		-app.js -- supposedly router but nothing yet
		-controllers.js -- connect data with view
		-services.js -- pull code from chrome.storage

	-styles
		-mystyles.css

	-views -- for now nothing

	-bower_components -- contains bootstrap modules

	-manifest.json -- configuration for setting up chrome extension

	More Functionalities:

	1. ability to schedule homework and exams as far as next week
	2. ability to rate class -- need to migrate to cloud database or sth
		-ability to search for class according to subject/teacher and add/rate class
		-ability to add personal favourite to the bigger database

