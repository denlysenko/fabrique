var Product = require('../models/products'),
		Image = require('../models/images'),
		DataSheet = require('../models/data_sheet'),
		Sale = require('../models/sale'),
		Wishlist = require('../models/wishlist'),
		Review = require('../models/reviews'),
		async = require('async'),
		config = require('../config'),
		HttpError = require('../error').HttpError,
		validator = require('validator');

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});	

exports.show = function(req, res, next) {
	var code = req.params.code;
	async.series([
		function(callback) {
			Product.findByCode(code, function(err, rows) {
				if(err) return callback(err);
				if(!rows.length) return callback(new HttpError(404, 'Product Not Found'));
				callback(null, rows);
			});
		},
		function(callback) {
			Image.findByCode(code, function(err, rows) {
				if(err) return callback(err);
				callback(null, rows);
			});
		},
		function(callback) {
			DataSheet.findByCode(code, function(err, rows) {
				if(err) return callback(err);
				callback(null, rows);
			});
		},
		function(callback) {
			Review.find(code, function(err, rows) {
				if(err) return callback(err);
				callback(null, rows);
			});
		}
	], function(err, results) {
		if(err) return next(err);
		var product = results[0][0],
				images = results[1],
				dataSheet = results[2],
				reviews = results[3];

		Product.update({views: product.views + 1}, code);		
		Product.findMostViewedByCategory(3, product.category, function(err, rows) {
			if(err) return next(err);
			res.render('product', {
				title: product.title,
				product: product,
				images: images,
				features: dataSheet,
				reviews: reviews,
				related: rows,
				page: req.path
			});
		});
	});
};

exports.category = function(req, res, next) {
	var category = req.params.category;
	Product.findMostViewedByCategory(1000, category, function(err, rows) {
		if(err) return next(err);
		if(!rows.length) return next(new HttpError(404, 'Category Not Found'));
		category = category.charAt(0).toUpperCase() + category.slice(1);
		res.render('products', {
			title: category,
			products: rows,
			page: req.path
		});
	});
};

exports.new = function(req, res, next) {
	var category = req.params.category;
	Product.findLastFromCategory(config.get('new:limit'), category, function(err, rows) {
		if(err) return next(err);
		if(!rows.length) return next(new HttpError(404, 'Category Not Found'));
		category = category.charAt(0).toUpperCase() + category.slice(1);
		res.render('products', {
			title: 'New in ' + category,
			products: rows,
			page: req.path
		});
	});
};

exports.sale = function(req, res, next) {
	Sale.find(function(err, rows) {
		if(err) return next(err);
		res.render('products', {
			title: 'Sale',
			products: rows,
			page: req.path
		});
	});
};

exports.wishlist = function(req, res) {
	var email = req.session.uid;

	Wishlist.find(email, function(err, rows) {
		if(err) return callback(err);
		res.render('products', {
			title: 'Wishlist',
			products: rows,
			page: req.path
		});
	});
};

exports.addToWishlist = function(req, res, next) {
	var code = req.params.code,
			email = req.session.uid;

	Wishlist.save({code: code, email: email}, function(err) {
		if(err && err.code === 'ER_DUP_ENTRY') return next(new HttpError(403, 'This item is already added'));
		if(err) return next(err);
		res.send('Successfully added to wishlist');
	});		
};

exports.removeFromWishlist = function(req, res, next) {
	var code = req.params.code;

	Wishlist.remove(code, function(err) {
		if(err) return next(err);
		res.send('/wishlist');
	});
};

exports.addToBasket = function(req, res, next) {
	var code = req.params.code,
			qty = +req.body.qty,
			i,
			basket;

	if(!req.session.basket) req.session.basket = [];

	if(!req.session.qty) req.session.qty = 0;

	basket = req.session.basket;
	if(!basket.length) {
		req.session.basket.push({code: code, qty: qty});
		req.session.qty += qty;
	} else { // checking if there is product with the same code in the basket
		for(i = 0; i < basket.length; i++) {
			var item = basket[i];
			if(item.code === code) {
				item.qty += qty;
				req.session.qty += qty;
				return res.end('Product successfully added to basket')
			} 
		}
		req.session.basket.push({code: code, qty: qty});
		req.session.qty += qty;
	}	
	res.end('Product successfully added to basket');
};

exports.removeFromBasket = function(req, res, next) {
	var code = req.params.code,
			basket = req.session.basket,
			i,
			len = basket.length;

	for(i = 0; i < len; i++) {
		var item = basket[i];
		if(item.code === code) {
			delete item.code;
			req.session.qty -= item.qty;
		}
	}		

	res.end();
};

exports.addReview = function(req, res, next) {
	var name = req.body.name,
			rate = req.body.rate,
			review = req.body.review,
			code = req.params.code;

	if(!validator.isNonEmpty(name)) {
		return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
	}	

	if(!validator.isInt(rate)) {
		return res.status(403).json(new HttpError(403, 'Rate should be a number'));
	}	

	if(!validator.isNonEmpty(review)) {
		return res.status(403).json(new HttpError(403, 'Review should be filled'));
	}		

	Review.save({
		name: name,
		rate: rate,
		review: review,
		code: code
	}, function(err) {
		if(err) return next(err);
		res.redirect('back');
	});			
};