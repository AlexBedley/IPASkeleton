'use strict';

module.exports = function (config) {
	
	config.set({	 
		basePath: '../',
		files: ['test/example/*.tests.js', 'src/*.js'],
		reporters : ['mocha', 'coverage'],
		coverageReporter: {
			dir : 'test/coverage/example',
			reporters: [
				{ type: 'lcov', subdir: 'lcov' },
				{ type: 'text'}
			]
		},
		frameworks: ['browserify', 'mocha', 'chai', 'sinon'],
		browserify:{ // "needed soon"
			extensions: ['.js'],
			transform: ['browserify-istanbul']
		},			
		preprocessors: {
			'test/example/*.tests.js': [ 'browserify' ], // "needed soon"
			'src/*.js': [ 'coverage', 'browserify' ]
		},
		port: 9876,
		colors: true,
		autoWatch: false,			
		// logLevel - LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_WARN, 
		browsers: ['PhantomJS'],
		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		browserNoActivityTimeout: 30000, // Team Gaudi did this temp
		singleRun: true,
		reportSlowerThan: 500
	});
}; 