'use strict';

var frau = require('free-range-app-utils'),
	gulp = require('gulp');

var appFilename = 'app.js';
var localAppResolver = frau.localAppResolver();

function makeAppConfig( target ) {
	return frau.appConfigBuilder.buildStream( target + appFilename )
		.pipe( gulp.dest('dist') );
}

gulp.task( 'appconfig-local', function() {
	return makeAppConfig( localAppResolver.getUrl() );
} );

gulp.task( 'appresolver', function() {
	localAppResolver.host();
} );
