'use strict';

var frau = require('free-range-app-utils'),
	gulp = require('gulp'),
	pjson = require('./package.json'),
	pg = require('peanut-gallery'),
	publisher = require('gulp-frau-publisher'),
	semver = require('semver');

var setFraTagOption = function(options) {
	var travisTag = process.env.TRAVIS_TAG;
	if (semver.valid(travisTag) !== null) {
		if (!semver.satisfies(travisTag, pjson.version)) {
			throw "Git tag does not match packages.json version, does it need to be updated?";
		}
		options.version = process.env.TRAVIS_TAG;
	} else {
		options.devTag = process.env.COMMIT_SHA;
	}
};

var options = {
	id: pjson.appId,
	creds: {
		"key": "AKIAJPKHVT3XFBAKFZWA",
		"secret": process.env.SECRET_KEY
	}
};
setFraTagOption(options);

var appFilename = 'app.js';
var localAppResolver = frau.localAppResolver();
var appPublisher = publisher.app(options);

function makeAppConfig(target) {
	return frau.appConfigBuilder.buildStream(target + appFilename)
		.pipe(gulp.dest('dist'));
}

gulp.task('appconfig-local', function() {
	return makeAppConfig(localAppResolver.getUrl());
});

gulp.task('appconfig-release', function() {
	return makeAppConfig(appPublisher.getLocation());
});

gulp.task('appresolver', function() {
	localAppResolver.host();
});

gulp.task('publish-release', function(cb) {
	gulp.src('./dist/**')
		.pipe(appPublisher.getStream())
		.on('end', function() {
			var message = '[Deployment available online](' + appPublisher.getLocation() + appFilename + ')';

			pg.comment(message, {}, function(error, response) {
				if (error)
					return cb(JSON.stringify(error));
				cb();
			});

		});
});
