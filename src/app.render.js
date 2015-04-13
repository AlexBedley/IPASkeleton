'use strict'
var langTerms = require('./lang-terms.js'),
	responsiveElement = require('./responsive-element.js'),
	BREAKPOINTS = [
		{ width: 957, type: "max-width", class: "bp-1" },
		{ width: 851, type: "max-width", class: "bp-2" },
		{ width: 741, type: "max-width", class: "bp-3" },
		{ width: 621, type: "max-width", class: "bp-4" }
	];
require('./scss/app.scss');

var initPage = function(parent, mainId, topId, bottomId, includeTop, includeBottom) {
	initHtml(parent, mainId, topId, bottomId, includeTop, includeBottom);
	if (includeTop) {
		responsiveElement(document.getElementById(topId), BREAKPOINTS);
	}
	if (includeBottom) {
		responsiveElement(document.getElementById(bottomId), BREAKPOINTS);
	}
};

var initHtml = function(parent, mainId, topId, bottomId, includeTop, includeBottom) {
	var html = '<div id="' + mainId + '" class="d2l-max-width">';
	if (includeTop) {
		html += '	<div id="' + topId + '" class="student-predictions" ><h3>' + langTerms['Headers']['Top'] + '</h2></div>';
	}
	if (includeBottom) {
		html += '	<div id="' + bottomId + '" class="student-predictions" ><h3>' + langTerms['Headers']['Bottom'] + '</h2></div>';
	}
	html += '</div>';

	parent.innerHTML = html;
};

var studentsHtml = function(parent, result) {
	var html = "<ol>";
	for (var x = 0,  c = result.length; x < c; x++) {
		html += singleStudentHtml(result[x]);
	}
	html += "</ol>";
	parent.innerHTML += html;
};

var singleStudentHtml = function(student){
	var html = '<li class="category-'+student.Prediction.CategoryId+'">';
		html += '	<div class="student-info">';
		html += '		<span class="name">'+student.Profile.Name+'</span>';
		html += '		<a class="s3 info" href="'+student.Profile.ProfileUrl+'">' + langTerms['Links']['MoreInfo'] + '</a>';
		html += '	</div>';
		html += '	<span class="predicted-grade">'+student.Prediction.RoundedValue+'</span>';
		html += '</li>';
	return html;
};

module.exports = {
	init: initPage,
	students: studentsHtml
}