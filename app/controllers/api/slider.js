var Product = require('../../models/products'),
		Slider = require('../../models/slider'),
		Image = require('../../models/images'),
		validator = require('validator'),
		async = require('async'),
		HttpError = require('../../errors').HttpError;

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});		

exports.slider = function(req, res, next) {
	var code = req.params.code;
	async.series([
		function(callback) {
			Product.findByCode(code, function(err, product) {
				if(err) return callback(err);
				callback(null, product);
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
				images = results[1];

		if(!product) return next(new HttpError(404, 'Product Not Found'));		
		res.render('app/products/slider', {
			title: 'Add ' + product.title + ' To Slider',
			product: product,
			images: images
		});
	});
};

exports.addToSlider = function(req, res, next) {
	var code = req.body.code,
			title = req.body.title,
			slogan = req.body.slogan,
			image = req.body.image;

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

	if(!validator.isNonEmpty(slogan)) {
		res.error('Slogan should contain letters and numbers');
		res.redirect('back');
		return;
	}		

	if(!image) {
		res.error('Please, choose image');
		res.redirect('back');
		return;
	}

	Slider.save({
		code: code,
		title: title,
		slogan: slogan,
		image: image
	}, function(err) {
		if(err) return next(err);
		res.message('Product with code ' + code + ' successfully added to slider');
		res.redirect('back');
	});
};

exports.sliderRemove = function(req, res, next) {
	Slider.find(function(err, rows) {
		if(err) return next(err);
		res.render('app/products/slider_remove', {
			title: 'Remove From Slider',
			results: rows
		});
	});
};

exports.removeFromSlider = function(req, res, next) {
	var id = req.params.id;
	Slider.remove(id, function(err) {
		if(err) return next(err);
		res.end();
	});
};

