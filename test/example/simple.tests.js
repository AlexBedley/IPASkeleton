'use strict';
var request = require('superagent');
var app = require('../../src/app.js');

var ERR = false;
var FIRST_NAME = 'Alex';
var LAST_NAME = 'Bedley';

var stubGet = function(ok) {
    sinon.stub(request, 'get', function(url) {
        var resp = {
            'body': {
                FirstName: FIRST_NAME,
                LastName: LAST_NAME
            },
            'ok': ok
        };
        var stub = {
            'use': function(auth) {
                return {
                    'end': function(cb) {
                        cb(ERR, resp);
                    }
                };
            }
        };
        return stub;
    });
};

describe("Testing app.js", function() {
    afterEach(function(done) {
        request.get.restore();
        done();
    });
    it('should set innerHTML to be body', function() {
        stubGet(true);
        var parent = {};
        app(parent);
        expect(parent.innerHTML).to.be.equal('Dobry Den, ' + FIRST_NAME + ' ' + LAST_NAME + '!');
    });
    it('should set innerHTML to be err', function() {
        stubGet(false);
        var parent = {};
        app(parent);
        expect(parent.innerHTML).to.be.equal(ERR);
    });
});