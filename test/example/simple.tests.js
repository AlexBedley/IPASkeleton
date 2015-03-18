var app = require('../../src/app.js');

describe("A test suite", function() {
    beforeEach(function() {});
    afterEach(function() {});
    it('should pass', function() {
        var parent = {};
        app(parent);
        expect(parent.innerHTML).to.be.equal("Hello, World!");
    });
});