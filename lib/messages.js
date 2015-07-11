var express = require('express');
var res = express.response;

res.message = function(msg, type) {
	type = type || 'bg-info';
	var session = this.req.session;
	session.messages = session.messages || [];
	session.messages.push({ type: type, string: msg });
};

res.error = function(msg) {
	return this.message(msg, 'bg-danger');
};

module.exports = function(req, res, next) {
	res.locals.messages = req.session.messages || [];
	res.locals.removeMessages = function() {
		req.session.messages = [];
	};
	next();
};