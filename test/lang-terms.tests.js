var langTermsJson = require('../src/locales/lang-terms.en-us.json');
var langTerms = require('../src/lang-terms.js');

langTermsJson = {
	"Headers": {
		"Top": "Alex",
		"Bottom": "Josh"
	},
	"Links" : {
		"MoreInfo": "Jon Falcon"
	}
};

describe('Testing lang-terms.js', function() {
	it('Top predictions header should be valid', function() {
		expect(langTerms.Headers.Top).to.be.equal('Alex');
	});
	it('Bottom predictions header should be valid', function() {
		expect(langTerms.Headers.Bottom).to.be.equal('Josh');
	});
	it('Link more info should be valid', function() {
		expect(langTerms.Links.MoreInfo).to.be.equal('Jon Falcon');
	});
});
