// Search results
var express = require('express');
var res = express.response;

res.result = function(result) {
	var session = this.req.session;
	session.results = result || [];
};

module.exports = function(req, res, next) {
	res.locals.results = req.session.results || [];
	res.locals.removeResults = function() {
		req.session.results = [];
	};
	next();
};