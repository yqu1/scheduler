# scheduler

Install: 

Clone the code and include the directory directly through chrome/window/extension/load extensions

Usage:

In all class view, + sign shows a form to add class, the class is automatically added to the day specified in the top tab. on clicking - sign shows a - button on every class, clicking on the - buttons delete the class. Mouse over the instructor will show the instuctor rating pulled from ratemyprofessors.com, and click on the instructor name will take users to the ratemyprofessors page of the instructor (if could't find the instructor on ratemyprofessors the link would just take users to the main page).


structure:

-scheduler_plugin

	-app

	-index.html -- index page

	-images
		-icon.png -- icon shown on chrome extension

	-scripts
		-app.js -- supposedly router but nothing yet
		-controllers.js -- connect data with view
		-services.js -- pull code from chrome.storage

	-styles
		-mystyles.css

	-views

		-main view: allow user to enter school information so that later could pull info from the correct school
		-all class view: display all classes
		-week view: display everyday class in the week


	-bower_components -- contains bootstrap modules

	-manifest.json -- configuration for setting up chrome extension

	More Functionalities:

	1. ability to schedule homework and exams as far as next week
	2. ability to rate class
		-ability to search for class according to subject/teacher and add/rate class
