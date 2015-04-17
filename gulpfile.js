'use strict';

var frau = require('free-range-app-utils'),
	gulp = require('gulp'),
	pjson = require('./package.json'),
	pg = require('peanut-gallery'),
	publisher = require('gulp-frau-publisher'),
	semver = require('semver'),
	del = require('del'),
	jshint = require('gulp-jshint'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	uglify = require('gulp-uglify'),
	streamify = require('gulp-streamify'),
	coveralls = require('gulp-coveralls'),
	lcovResultMerger = require('lcov-result-merger'),
	karma = require('node-karma-wrapper'),
	gulp_if = require('gulp-if');

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

gulp.task('appconfig-local', ['clean'], function() {
	return makeAppConfig(localAppResolver.getUrl());
});

gulp.task('appconfig-release', ['clean'], function() {
	return makeAppConfig(appPublisher.getLocation());
});

gulp.task('appresolver', function() {
	localAppResolver.host();
});

gulp.task('publish-release', ['browserify-release', 'appconfig-release'], function(cb) {
	gulp.src('./dist/**')
		.pipe(appPublisher.getStream())
		.on('end', function() {
			var message = '##### Deployment available online:\n' +
				'#### - [' + appFilename + '](' + appPublisher.getLocation() + appFilename + ')\n' +
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

gulp.task('clean', function(cb) {
	del(['./dist/**/*'], cb);
});

gulp.task('lint', function() {
	return gulp.src(['./src/**/*.js', './test/**/*.js', './gulpfile.js', '!./test/coverage/**/*'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'))
		.on('error', function(error) {
			throw error;
		});
});

var browserifyUglify = function(release) {
	var b = browserify({
			entries: './src/' + appFilename,
			standalone: 'IPA'
		})
		.external('d2l-orgunit');

	return b.bundle()
		.pipe(source(appFilename))
		.pipe(gulp_if(release, streamify(uglify())))
		.pipe(gulp.dest('./dist'));
};

gulp.task('browserify', ['clean', 'lint'], function() {
	browserifyUglify(false);
});

gulp.task('browserify-release', ['clean', 'lint'], function() {
	browserifyUglify(true);
});

gulp.task('coveralls', function() {
	gulp.src('./test/coverage/*/lcov/lcov.info')
		.pipe(lcovResultMerger())
		.pipe(coveralls());
});

var karmaSetup = function(browsers) {
	var opts = {
		configFile: './test/example.karma.conf.js',
		'browsers': browsers
	};
	return karma(opts);
};

gulp.task('test', ['lint'], function(cb) {
	var karmaServer = karmaSetup(['PhantomJS']);
	karmaServer.simpleRun(cb);
});

gulp.task('test-browsers', ['lint'], function(cb) {
	var browsers = ['Firefox', 'PhantomJS'];
	if (process.env.TRAVIS) {
		browsers.push('Chrome_travis_ci');
	} else {
		browsers.push('Chrome');
	}
	var karmaServer = karmaSetup(browsers);
	karmaServer.simpleRun(cb);
});

gulp.task('build', ['browserify', 'appconfig-local']);

gulp.task('default', ['build']);