
module.exports = function(req, res ,next) {
	if(!req.session.manager) return next();
		manager = res.locals.manager = req.session.manager;
		next();
};