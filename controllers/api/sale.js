var Product = require('../../models/products'),
		Sale = require('../../models/sale'),
		validator = require('validator'),
		async = require('async');

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});			

exports.sale = function(req, res, next) {
	var code = req.params.code;
	Product.findByCode(code, function(err, rows) {
		if(err) return next(err);
		res.render('api/products/sale', {
			title: 'Add Product On Sale',
			product: rows[0]
		});
	});
};

exports.addToSale = function(req, res, next) {
	var code = req.body.code,
			title = req.body.title,
			price = req.body.price,
			discount = req.body.discount;

	if(!validator.isAlphanumeric(code)) {
		res.error('Code should contain only letter or numbers');
		res.redirect('back');
		return;
	}

	if(!validator.isNonEmpty(title)) {
		res.error('Title should contain letters and numbers');
		res.redirect('back');
		return;
	}	

	if(!validator.isFloat(price)) {
		res.error('Price should contain decimal numbers');
		res.redirect('back');
		return;
	}		

	if(!validator.isInt(discount, {min: 1, max: 99})) {
		res.error('Discount should be in the range 1 - 99');
		res.redirect('back');
		return;
	}

	var newPrice = (price - price*discount/100).toFixed(2);

	Sale.save({
		code: code,
		title: title,
		'old_price': price,
		'new_price': newPrice,
		discount: discount
	}, function(err) {
		if(err && err.code === 'ER_DUP_ENTRY') {
			res.error('Product with ' + code + ' has been already added');
			return res.redirect('/api/sale');
		}

		if(err) return next(err);
		Product.update({price: newPrice, sale: discount}, code, function(err) {
			if(err) return next(err);
			res.message('Product with code ' + code + ' successfully added on sale');
			res.redirect('back');
		});
	});
};

exports.saleRemove = function(req, res, next) {
	Sale.findAll(function(err, rows) {
		if(err) return next(err);
		res.render('api/products/sale_remove', {
			title: 'Remove From Sale',
			results: rows
		});
	});
};

exports.removeFromSale = function(req, res, next) {
	var id = req.params.id;
	async.waterfall([
		function(callback) {
			Sale.findById(id, function(err, result) {
				if(err) return callback(err);
				callback(null, result[0]);
			});
		},
		function(result, callback) {
			Product.update({price: result.old_price, sale: 'NULL'}, result.code, function(err) {
				if(err) return callback(err);
				callback(null);
			});
		},
		function(callback) {
			Sale.remove(id, callback);
		}
	], function(err) {
		if(err) return next(err);
		res.send('/api/sale/remove');
	});
};