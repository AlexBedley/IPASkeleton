'use strict';
var request = require('superagent'),
	api = require('../src/student-predictions.service.js');

var setupStubs= function(endErr, endOk) {
	var stubEnd = getStubForRequestEnd(endErr, endOk),
		stubUse = getStubForRequestUse(stubEnd),
		stubQuery = getStubForRequestQuery(stubUse),
		stubGet = getStubForRequestGet(stubQuery);
	return {
		'end': stubEnd,
		'use': stubUse,
		'query': stubQuery,
		'get': stubGet
	};
};
var getStubForRequestGet = function(stubQuery) {
	return sinon.stub(request, 'get', function(url) {
        var stub = {
			'query': stubQuery
        };
        return stub;
    });
};
var getStubForRequestQuery = function(stubUse) {
	return sinon.stub().returns({
		'use': stubUse
	});
};
var getStubForRequestUse = function(stubEnd) {
	return sinon.stub().returns({
		'end': stubEnd
	});
};
var getStubForRequestEnd = function(err, ok) {
	err = typeof err !== 'undefined' ? err : false;
	ok = typeof ok !== 'undefined' ? ok : true;
	var resp = {
		'body': {
			Test: "Test"
		},
		'ok': ok
    };
	return function(callback) {
		callback(err, resp);
	};
};

describe("Testing student-predictions.service.js", function() {
    afterEach(function(done) {
        request.get.restore();
        done();
    });
    it('For a given orgunitid, should make correct URL request', function() {
		var ORG_UNIT_ID = 999,
			EXPECTED_URL = '/d2l/api/ipa/unstable/courses/' + ORG_UNIT_ID + '/students/predictions/',
			stubs = setupStubs();

		api(ORG_UNIT_ID, function(){}, function(){}, {});

        expect(stubs.get.args[0][0]).to.be.equal(EXPECTED_URL);
    });
	it('When no options are set, should make request with default number of students and sort order in query parameters', function() {
		var	EXPECTED_DEFAULT_NUM_STUDENTS = 10,
			stubs = setupStubs();

		api("", function(){}, function(){}, {});

        expect(stubs.query.args[0][0].numStudents).to.be.equal(EXPECTED_DEFAULT_NUM_STUDENTS);
		expect(stubs.query.args[0][0].isAscending).to.be.false;
    });
	it('When the number of students and sort order is set, should make request with correct query parameters', function() {
		var	NUM_STUDENTS = 5,
			SORT_ORDER = 'asc',
			OPTIONS = {
				sortOrder: 'asc',
				numStudents: NUM_STUDENTS
			},
			stubs = setupStubs();

		api("", function(){}, function(){}, OPTIONS);

        expect(stubs.query.args[0][0].numStudents).to.be.equal(NUM_STUDENTS);
		expect(stubs.query.args[0][0].isAscending).to.be.true;
    });
	it('When api returns an error, should call error callback and not success callback', function() {
		var	successCallback = sinon.stub(),
			errorCallback = sinon.stub();
		setupStubs(true, true);

		api("", successCallback, errorCallback, {});

		expect(errorCallback.calledOnce).to.be.true;
		expect(successCallback.calledOnce).to.be.false;
    });
	it('When api result indicates an error, should call error callback and not success callback', function() {
		var	successCallback = sinon.stub(),
			errorCallback = sinon.stub();
		setupStubs(false, false);

		api("", successCallback, errorCallback, {});

        expect(errorCallback.calledOnce).to.be.true;
		expect(successCallback.calledOnce).to.be.false;
    });
	it('For a valid request, should call success callback and not error callback', function() {
		var	successCallback = sinon.stub(),
			errorCallback = sinon.stub();
		setupStubs();

		api("", successCallback, errorCallback, {});

        expect(errorCallback.calledOnce).to.be.false;
		expect(successCallback.calledOnce).to.be.true;
    });
});