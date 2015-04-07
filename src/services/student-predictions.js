var request = require('superagent'),
	auth = require('superagent-d2l-session-auth'),
	extend = require('extend'),
	URI_STUDENT_PREDICTIONS = '/d2l/api/ipa/unstable/courses/{orgUnitId}/students/predictions/',
	DEFAULT_OPTIONS = {
		sortOrder: "desc",
		numStudents: 10		
	};

module.exports = function(orgUnitId, succCallback, errCallback, options) {
	options = extend(DEFAULT_OPTIONS, options);	
	var queryParams = { 
		numStudents: options.numStudents,
		isAscending: (options.sortOrder === "asc")
	};
		
	request
		.get(String.replace(URI_STUDENT_PREDICTIONS,'{orgUnitId}',orgUnitId))
		.query(queryParams)
		.use(auth)
		.end(function(err, res) {
			if (err || !res.ok) {
				errCallback(err, res);
				return undefined;
			}			
			succCallback(res);
		});
};