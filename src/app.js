'use strict';
var studentPredictions = require('./student-predictions.service.js'),
	render = require('./app.render.js'),	
	d2lOrgUnit = require('d2l-orgunit'),
	extend = require('extend'),
	DEFAULT_IPA_SKELETON_OPTIONS = {
		numStudents: 10,
		includeTop: true,
		includeBottom: true,
		orgUnitId: 122042, // just for testing FRA on non-course pages in LE
		mainId: 'ipa-student-predictions',
		topId: 'ipa-top-student-predictions',
		bottomId: 'ipa-bottom-student-predictions'
	},
	ipaSkeletonOptions = {};

var getOrgUnitId = function() {
	return (d2lOrgUnit.OrgUnitId !== d2lOrgUnit.OrgId) ? d2lOrgUnit.OrgUnitId : ipaSkeletonOptions.orgUnitId;
};

var setupIds = function(baseId) {	
	ipaSkeletonOptions.mainId = baseId + '-' + ipaSkeletonOptions.mainId;
	ipaSkeletonOptions.topId = baseId + '-' + ipaSkeletonOptions.topId;
	ipaSkeletonOptions.bottomId = baseId + '-' + ipaSkeletonOptions.bottomId;
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

module.exports = function(parent, options) {
	ipaSkeletonOptions = extend(DEFAULT_IPA_SKELETON_OPTIONS, options.IPASkeleton);
	
	var orgUnitId = getOrgUnitId();
	
	setupIds(parent.id);
	
	render.init(
		parent, 
		ipaSkeletonOptions.mainId, 
		ipaSkeletonOptions.topId, 
		ipaSkeletonOptions.bottomId, 
		ipaSkeletonOptions.includeTop, 
		ipaSkeletonOptions.includeBottom
	);	
	
	if (ipaSkeletonOptions.includeTop) {
		studentPredictions(
			orgUnitId,
			studPredSucc(document.getElementById(ipaSkeletonOptions.topId)),
			studPredErr,
			{ sortOrder: "desc", numStudents: ipaSkeletonOptions.numStudents }
		);	
	}
	if (ipaSkeletonOptions.includeBottom) {
		studentPredictions(
			orgUnitId,
			studPredSucc(document.getElementById(ipaSkeletonOptions.bottomId)),
			studPredErr,
			{ sortOrder: "asc", numStudents: ipaSkeletonOptions.numStudents  }
		);
	}
};