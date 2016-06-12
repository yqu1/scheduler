var request = require("request");
var fs = require('fs');

var rmpsearch = 'http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=william+&+mary+school+of+law&queryoption=HEADER&query=Charles Johnson&facetSearch=true';


request(rmpsearch, function(err, res, bod) {
	
	var professorURLExtension = "/ShowRatings.jsp?tid=787287"
	var professorPageURL = 'http://www.ratemyprofessors.com' + professorURLExtension;
	request(professorPageURL, function(error, response, body) {
			fs.writeFile("response.txt", body, function(err) {
				if(err) {
					return console.log(err)
				}
				console.log("file saved")
			})
	})
})