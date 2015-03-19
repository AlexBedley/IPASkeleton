'use strict';

var request = require('superagent');
var auth = require('superagent-d2l-session-auth');

module.exports = function(parent) {
	request
		.get('/d2l/api/lp/1.5/users/whoami')
		.use(auth)
		.end(function(err, res) {
			var user = res.body;
			parent.innerHTML = 'Hello, ' + user.FirstName + ' ' + user.LastName + '!';

			if (err || !res.ok) {
				//handle error & consider returning promise
				parent.innerHTML = err;
			}
		});
};