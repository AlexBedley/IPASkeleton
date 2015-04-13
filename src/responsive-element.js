'use strict'

var assignBreakpointClasses = function(parent, breakpoints) {
	var parentWidth = parent.offsetWidth;
		
	for (var x=0, l=breakpoints.length; x < l; x++) {
		if (parentWidth < breakpoints[x].width) {			
			parent.className += ' ' + breakpoints[x].class;
		}
	}
};

module.exports = function(parent, breakpoints) { // TO DO improve bp handling to recheck on resize (but effeciently...) into own module
	assignBreakpointClasses(parent, breakpoints);
}