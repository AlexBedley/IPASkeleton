'use strict';

module.exports = function (config) {
	
	config.set({	 
		basePath: '../',
		files: ['test/*.tests.js'],
		reporters : ['progress', 'coverage'],
		coverageReporter: {
			dir : 'test/coverage',
			reporters: [
				{ type: 'lcov', subdir: 'lcov' },
				{ type: 'text'}
			]
		},
		frameworks: ['browserify', 'mocha', 'chai', 'sinon'],
		browserify:{ 
			extensions: ['.js'],
			transform: ['browserify-istanbul', 'sassify'],
			configure: function(bundle) {
				bundle.on('prebundle', function() {
					bundle.external( ['d2l-IPASkeleton-options', 'd2l-orgunit'] );
				});
			}
		},			
		preprocessors: {
			'test/*.tests.js': [ 'browserify' ], // "needed soon"
			'src/*.js': [ 'coverage', 'browserify' ]
		},
		port: 9876,
		colors: true,
		autoWatch: false,			
		// logLevel - LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO, 
		browsers: ['PhantomJS'],		
		browserNoActivityTimeout: 30000, // Team Gaudi did this temp
		singleRun: true
	});
}; 