'use strict';

var frau = require('free-range-app-utils'),
	gulp = require('gulp'),
	pjson = require('./package.json'),
	pg = require('peanut-gallery'),
	publisher = require('gulp-frau-publisher'),
	semver = require('semver'),
	open = require("open"),
	del = require('del'),
	jshint = require('gulp-jshint');

var setValidDevTagOrVersion = function(options) {
	var tag = process.env.GIT_CUR_TAG;
	if (semver.valid(tag)) {
		if (!semver.satisfies(tag, pjson.version)) {
			throw "Tag '" + tag + "' does not match packages.json version, does it need to be updated?";
		}
		options.version = tag;
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
setValidDevTagOrVersion(options);

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
			var message = '##### Deployment available online:\n' +
				'#### - [app.js](' + appPublisher.getLocation() + appFilename + ')\n' +
				'#### - [appconfig.json](' + appPublisher.getLocation() + 'appconfig.json)';

			pg.comment(message, {}, function(error, response) {
				if (error)
					return cb(JSON.stringify(error));
				cb();
			});
		})
		.on('error', function(error) {
			console.log(error);
			process.exit(1);
		});
});

gulp.task('coverage', function() {
	open('./test/coverage/example/lcov/lcov-report/index.html');
});

gulp.task('clean', function(cb) {
	del(['./dist/**/*'], cb);
});

gulp.task('lint', function() {
	return gulp.src(['./src/**/*.js', './test/**/*.js', './gulpfile.js', '!./test/coverage/**/*'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});