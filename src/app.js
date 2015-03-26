'use strict';
var studentPredictions = require('./services/student-predictions.js'),
	ORG_UNIT_ID = 122034; // to do pull org unit id from page

	require('./scss/app.scss');

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
	var MAIN_ID = 'ipa-student-predictions', // to do create unique instance namespace
		TOP_ID = 'ipa-top-student-predictions',
		BOTTOM_ID = 'ipa-bottom-student-predictions',
		html;

	html = '<div id="' + MAIN_ID + '" class="d2l-max-width">';
	html += '	<div id="' + TOP_ID + '" class="student-predictions" ><h3>Top Predictions</h2></div>'
	html += '	<div id="' + BOTTOM_ID + '" class="student-predictions" ><h3>Bottom Predictions</h2></div>';
	html += '</div>';
	parent.innerHTML = html;

	assignParentBreakpoint(document.getElementById(TOP_ID));
	studentPredictions(
		ORG_UNIT_ID,
		studPredSucc(document.getElementById(TOP_ID)),
		studPredErr,
		{ sortOrder: "desc", numStudents: 8 }
	);

	assignParentBreakpoint(document.getElementById(BOTTOM_ID));
	studentPredictions(
		ORG_UNIT_ID,
		studPredSucc(document.getElementById(BOTTOM_ID)),
		studPredErr,
		{ sortOrder: "asc", numStudents: 8 }
	);
};