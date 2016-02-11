var HttpError = require('../modules/errors').HttpError;

module.exports = function(req, res, next) {
	if(!req.session.uid) {
		return next(new HttpError(401, "Unauthorized"));
	}
	next();
};