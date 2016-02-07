var Product = require('../../models/products'),
		DataSheet = require('../../models/data_sheet'),
		Image = require('../../models/images'),
		async = require('async'),
		HttpError = require('../../errors').HttpError;

module.exports = function(req, res, next) {
	var code = req.params.code;
	async.series([
		function(callback) {
			Product.findByCode(code, function(err, product) {
				if(err) return callback(err);
				callback(null, product);
			});
		},
		function(callback) {
			DataSheet.findByCode(code, function(err, data) {
				if(err) return callback(err);
				callback(null, data);
			});
		},
		function(callback) {
			Image.findByCode(code, function(err, images) {
				if(err) return callback(err);
				callback(null, images);
			});
		}
	], function(err, results) {
		var product = results[0][0],
				features = results[1],
				images = results[2];
		if(!product) return next(new HttpError(404, 'Product Not Found'));		
		res.render('app/products/edit', {
			title: 'Edit ' + product.title,
			product: product,
			images: images,
			features: features
		});
	});
};