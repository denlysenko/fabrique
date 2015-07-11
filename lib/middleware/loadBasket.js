module.exports = function(req, res, next) {
	if(!req.session.qty) {
		qty = res.locals.qty = 0;
		next();
	} else {
		qty = res.locals.qty = req.session.qty;
		next();
	}
};