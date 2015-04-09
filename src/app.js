'use strict';
var studentPredictions = require('./services/student-predictions.js'),
	d2lOrgUnit = require('d2l-orgunit'),
	d2lOptions = require('d2l-options'),
	extend = require('extend'),
	options = {},
	DEFAULT_OPTIONS = {
		numStudents: 8,
		orgUnitId: 122042
	};

require('./scss/app.scss');

options = extend(DEFAULT_OPTIONS, d2lOptions);

var getOrgUnitId = function() {
	return (d2lOrgUnit.OrgUnitId !== d2lOrgUnit.OrgId) ? d2lOrgUnit.OrgUnitId : options.orgUnitId;
}

var studPredSucc = function (parent) {
	return function(res) {
		var html = "<ol>";
		res = JSON.parse(res.text);
		for (var x = 0,  c = res.length; x < c; x++) {
			html += studentHtml(res[x]);
		}
		html += "</ol>";
		parent.innerHTML += html;
	}
}

var studentHtml = function(student){
	var html = '<li class="category-'+student.Prediction.CategoryId+'">';
		html += '	<div class="student-info">';
		html += '		<span class="name">'+student.Profile.Name+'</span>';
		html += '		<a class="s3 info" href="'+student.Profile.ProfileUrl+'">More Info</a>';
		html += '	</div>';
		html += '	<span class="predicted-grade">'+student.Prediction.RoundedValue+'</span>';
		html += '</li>';
	return html;
}

// to do improve error handling
var studPredErr = function(err, res){
	console.log("Encountered an api error:");
	console.log(err);
	console.log(res);
}

var assignParentBreakpoint = function(parent) {
	var parentWidth = parent.offsetWidth,
		breakpoints = {
			957: "bp-1",
			851: "bp-2",
			741: "bp-3",
			621: "bp-4"
		};
	for (var breakpointWidth in breakpoints) {
		if (parentWidth < breakpointWidth) {
			console.log("bp "+breakpointWidth);
			parent.className += ' '+breakpoints[breakpointWidth];
		}
	}
}

module.exports = function(parent) {
	var baseId = parent.id,
		MAIN_ID = baseId+'-ipa-student-predictions', // to do create unique instance namespace
		TOP_ID = baseId+'-ipa-top-student-predictions',
		BOTTOM_ID = baseId+'-ipa-bottom-student-predictions',
		html,
		orgUnitId = getOrgUnitId();

	html = '<div id="' + MAIN_ID + '" class="d2l-max-width">';
	html += '	<div id="' + TOP_ID + '" class="student-predictions" ><h3>Top Predictions</h2></div>'
	html += '	<div id="' + BOTTOM_ID + '" class="student-predictions" ><h3>Bottom Predictions</h2></div>';
	html += '</div>';
	parent.innerHTML = html;

	assignParentBreakpoint(document.getElementById(TOP_ID));
	studentPredictions(
		orgUnitId,
		studPredSucc(document.getElementById(TOP_ID)),
		studPredErr,
		{ sortOrder: "desc", numStudents: options.numStudents }
	);

	assignParentBreakpoint(document.getElementById(BOTTOM_ID));
	studentPredictions(
		orgUnitId,
		studPredSucc(document.getElementById(BOTTOM_ID)),
		studPredErr,
		{ sortOrder: "asc", numStudents: options.numStudents  }
	);
};