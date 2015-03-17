'use strict';

var frau = require('free-range-app-utils'),
	gulp = require('gulp'),
	pjson = require('./package.json'),
	publisher = require('gulp-frau-publisher'),
	key = require('./private-key.js');

var options = {
    id: pjson.appId,
    creds: {
        "key": "AKIAJPKHVT3XFBAKFZWA",
        "secret": key
    },
    devTag: 'test02'
};

var appFilename = 'app.js';
var localAppResolver = frau.localAppResolver();
var appPublisher = publisher.app( options );

function makeAppConfig( target ) {
	return frau.appConfigBuilder.buildStream( target + appFilename )
		.pipe( gulp.dest('dist') );
}

gulp.task( 'appconfig-local', function() {
	return makeAppConfig( localAppResolver.getUrl() );
} );

gulp.task('appconfig-release', function () {
    return makeAppConfig( appPublisher.getLocation() );
});

gulp.task( 'appresolver', function() {
	localAppResolver.host();
} );

gulp.task( 'publish-release', function( cb ) {
	gulp.src('./dist/**')
		.pipe( appPublisher.getStream() );
});
