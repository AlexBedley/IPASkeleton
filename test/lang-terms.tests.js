var langTermsJson = require('../src/locales/lang-terms.en-us.json'),
	langTerms = require('../src/lang-terms.js');
	
var TEST_VALUE = 'Test Value';
langTermsJson.Headers.Top = TEST_VALUE;
	
describe('Testing lang-terms.js', function() {
	it('Lang term should be valid', function() {
		expect(langTermsJson.Headers.Top).to.be.equal(TEST_VALUE);
	});
});
