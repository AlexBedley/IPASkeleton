'use strict';
var studentPredictions = require('./student-predictions.service.js'),
	render = require('./app.render.js'),	
	d2lOrgUnit = require('d2l-orgunit'),
	d2lOptions = require('d2l-IPASkeleton-options'),
	extend = require('extend'),
	DEFAULT_OPTIONS = {
		numStudents: 10,
		includeTop: true,
		includeBottom: true,
		orgUnitId: 122042, // just for testing FRA on non-course pages in LE
		mainId: 'ipa-student-predictions',
		topId: 'ipa-top-student-predictions',
		bottomId: 'ipa-bottom-student-predictions'
	},
	options = extend(DEFAULT_OPTIONS, d2lOptions);

var getOrgUnitId = function() {
	return (d2lOrgUnit.OrgUnitId !== d2lOrgUnit.OrgId) ? d2lOrgUnit.OrgUnitId : options.orgUnitId;
};

var setupIds = function(baseId) {	
	options.mainId = baseId + '-' + options.mainId;
	options.topId = baseId + '-' + options.topId;
	options.bottomId = baseId + '-' + options.bottomId;
};

var studPredSucc = function (parent) {
	return function(result) {
		result = JSON.parse(result.text);
		render.students(parent, result);		
	}
};

var studPredErr = function(err, res){ // TO DO improve error handling
	console.log("Encountered an api error:");
	console.log(err);
	console.log(res);
};

module.exports = function(parent) {
	var orgUnitId = getOrgUnitId();
	setupIds(parent.id);
	
	render.init(parent, options.mainId, options.topId, options.bottomId, options.includeTop, options.includeBottom);	
	
	if (options.includeTop) {
		studentPredictions(
			orgUnitId,
			studPredSucc(document.getElementById(options.topId)),
			studPredErr,
			{ sortOrder: "desc", numStudents: options.numStudents }
		);	
	}
	if (options.includeBottom) {
		studentPredictions(
			orgUnitId,
			studPredSucc(document.getElementById(options.bottomId)),
			studPredErr,
			{ sortOrder: "asc", numStudents: options.numStudents  }
		);
	}
};