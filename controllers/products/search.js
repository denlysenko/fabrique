var Product = require('../../models/products'),
		url = require('url');

module.exports = function(req, res, next) {
	var query = url.parse(req.url).query;
	var parts = query.split('=');
	if(parts[0] === 'category') {
		Product.findByCategory(parts[1].toLowerCase(), function(err, products) {
			if(err) return next(err);
			if(!products.length) {
				res.error('Products not found');
				res.redirect('back');
			} else {
				res.result(products);
				res.redirect('back');
			}
		});
	} else if(parts[0] === 'code') {
		Product.findByCode(parts[1].toLowerCase(), function(err, products) {
			if(err) return next(err);
			if(!products.length) {
				res.error('Product with code ' + parts[1] + ' not found');
				res.redirect('back');
			} else {
				res.result(products);
				res.redirect('back');
			}
		});
	} else if(parts[0] === 'title') {
		Product.findByTitle(parts[1], function(err, products) {
			if(err) return next(err);
			if(!products.length) {
				res.error('Product ' + parts[1] + ' not found');
				res.redirect('back');
			} else {
				res.result(products);
				res.redirect('back');
			}
		});
	}
};