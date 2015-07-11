var HttpError = require('../../error').HttpError;

module.exports = function(req, res, next) {
	if(!req.session.manager) {
		return res.redirect('/api/authenticate');
	}
	next();
};