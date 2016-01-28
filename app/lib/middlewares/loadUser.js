var Client = require('.././clients');

module.exports = function(req, res ,next) {
	if(!req.session.uid) return next();
	Client.find(req.session.uid, function(err, user) {
		if(err) return next(err);
		user = res.locals.user = user;
		next();
	});
};