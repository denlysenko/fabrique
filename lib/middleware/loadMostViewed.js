var Product = require('../../models/products');

module.exports = function(req, res, next) {
	Product.findMostViewed(4, function(err, rows) {
		if(err) return next(err);
		mostViewed = res.locals.mostViewed = rows;
		next();
	});
};