var request = require('superagent');
var app = require('../../src/app.js');

describe("A test suite", function() {
    before(function(done) {
        sinon.stub(request, 'get', function(url) {
            var resp = {
                body: {
                    FirstName: "Alex",
                    LastName: "Bedley"
                },
                ok: true
            };
            var stub = {
                use: function(auth) {
                    return {
                        end: function(cb) {
                            cb(false, resp);
                        }
                    };
                }
            };
            return stub;
        });
        done();
    });
    after(function(done) {
        request.get.restore();
        done();
    });
    it('should pass', function() {
        var parent = {};
        app(parent);
        expect(parent.innerHTML).to.be.equal('Hello, Alex Bedley!');
    });
});