var Product = require('../../models/products'),
		Image = require('../../models/images'),
		DataSheet = require('../../models/data_sheet'),
		Sale = require('../../models/sale'),
		Review = require('../../models/reviews'),
		Slider = require('../../models/slider'),
		image = require('../../images'),
		async = require('async');

module.exports = function(req, res, next) {
	var code = req.params.code;
	async.series([
		function(callback) {
			Product.remove(code, callback);
		},
		function(callback) {
			DataSheet.findByCodeAndRemove(code, callback);
		},
		function(callback) {
			Sale.removeAll(code, callback);
		},
		function(callback) {
			Slider.removeAll(code, callback);
		},
		function(callback) {
			Review.removeAll(code, callback);
		},
		function(callback) {
			Image.findByCode(code, function(err, images) {
				if(err) return callback(err);
				callback(null, images);
			})
		},
		function(callback) {
			Image.findByCodeAndRemove(code, callback);
		}
	], function(err, results) {
		if(err) return next(err);
		if(results[5].length) {
			image.remove(results[5], function(err) {
				if(err) return next(err);
				res.message('Product with code ' + code + ' successfully removed', 'bg-success');
				res.send('/api/products/edit');
			});
		} else {
			res.message('Product with code ' + code + ' successfully removed', 'bg-success');
			res.send('/api/products/edit');
		}
	});
};