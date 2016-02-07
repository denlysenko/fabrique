var HttpError = require('../../errors').HttpError;

module.exports = function(req, res, next) {
	if(!req.session.manager) {
		return res.redirect('/app/authenticate');
	}
	next();
};