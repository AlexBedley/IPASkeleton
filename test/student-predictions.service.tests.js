var request = require('superagent'),
	api = require('../src/student-predictions.service.js');

var getStubsForRequestGet = function() {	
	var use = sinon.stub().returns( 
			{ 
				'end': function(cb) {
					cb({}, {});
				}
			} 
		),	
		query = sinon.stub().returns( 
			{ 
				'use': use 
			}
		),	
		get = sinon.stub(request, 'get').returns(
			{ 
				'query': query 
			}
		);	
	
	return {
		'get': get,
		'query': query,
		'use': use
	};
};
	
describe("Testing student-predictions.service.js", function() {
    afterEach(function(done) {
        request.get.restore();
        done();
    });
	
    it('For a given orgunitid, should make correct URL request', function() {                
		var ORG_UNIT_ID = 999,
			EXPECTED_URL = '/d2l/api/ipa/unstable/courses/' + ORG_UNIT_ID + '/students/predictions/';
			stubs = getStubsForRequestGet();
		
		api(ORG_UNIT_ID, function(){}, function(){}, {});		
        expect(stubs.get.args[0][0]).to.be.equal(EXPECTED_URL);
    });
	
});