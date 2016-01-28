var Product = require('.././products');

module.exports = function(req, res, next) {
	Product.findLast(4, function(err, rows) {
		if(err) return next(err);
		last = res.locals.last = rows;
		next();
	});
};		