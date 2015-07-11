var validator = require('validator'),
		Product = require('../../models/products'),
		DataSheet = require('../../models/data_sheet'),
		Image = require('../../models/images'),
		async = require('async'),
		image = require('../../images');

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});

module.exports = function(req, res, next) {
	var code = req.body.code,
		category = req.body.category,
		title = req.body.title,
		desc = req.body.description,
		info = req.body.info,
		price = req.body.price,
		feature = req.body.feature,
		characteristic = req.body.characteristic,
		dataSheet,
		images;

	if(!validator.isAlphanumeric(code)) {
		res.error('Code should contain only letter or numbers');
		res.redirect('back');
		return;
	} 

	code = code.trim();

	if(!validator.isAlpha(category)) {
		res.error('Category should contain letters');
		res.redirect('back');
		return;
	} 

	if(!validator.isNonEmpty(title)) {
		res.error('Title should contain letters and numbers');
		res.redirect('back');
		return;
	}	

	if(!validator.isNonEmpty(desc)) {
		res.error('Description should contain letters and numbers');
		res.redirect('back');
		return;
	} 

	if(!validator.isNonEmpty(info)) {
		res.error('Info should contain letters and numbers');
		res.redirect('back');
		return;
	} 

	if(!validator.isFloat(price)) {
		res.error('Price should contain decimal numbers');
		res.redirect('back');
		return;
	} 

		
	if(typeof feature === 'string') {
		if(!validator.isNonEmpty(feature)) {
			res.error('Feature should contain letters and numbers');
			res.redirect('back');
			return;
		} 
	
	if(!validator.isNonEmpty(characteristic)) {
			res.error('Characteristic should contain letters and numbers');
			res.redirect('back');
			return;
		} 

		dataSheet = [[code, feature, characteristic]];
	} else {
		var tmp;
		dataSheet = [];

		for(var i = 0; i < feature.length; i++) {
			if(!validator.isNonEmpty(feature[i])) {
				res.error('Feature should contain letters and numbers');
				res.redirect('back');
				return;
			} 
	
			if(!validator.isNonEmpty(characteristic[i])) {
				res.error('Characteristic should contain letters and numbers');
				res.redirect('back');
				return;
			} 
			tmp = [code, feature[i], characteristic[i]];
			dataSheet.push(tmp);
		}
	}

	if(!req.files.photo) {
		res.error('Please, choose photos', 'bg-danger');
		res.redirect('back');
		return;
	}
	
	if(Array.isArray(req.files.photo)) {
		images = [];
		async.eachSeries(req.files.photo, function(photo, callback) {
			if(photo.mimetype.indexOf('jpeg') === -1 && photo.mimetype.indexOf('png') === -1) {
				res.error('Image should be in JPEG or PNG format');
				res.redirect('back');
				return;
			}

			image.load(photo.path, function(err, results) {
				if(err && err.status === 400) {
					res.error('Image already exists');
					res.redirect('back');
					return;
				}

				if(err) return callback(err);
				var tmp = [code];
				Array.prototype.push.apply(tmp, results); // merge two arrays
				images.push(tmp);
				callback(null);
			});
		}, function(err) {
			if(err) return next(err);

			async.series([
				function(callback) {
					Product.save({
						code: code,
						category: category,
						title:title,
						desc: desc,
						info: info,
						price: price
					}, callback);
				},
				function(callback) {
					DataSheet.save(dataSheet, callback);
				},
				function(callback) {
					Image.save(images, callback);
				}
			], function(err) {
					if(err && err.code === 'ER_DUP_ENTRY') {
						res.error('Product with ' + code + ' already exists');
						res.redirect('back');
					} else if(err) {
						return next(err);
					} else {
						res.message('Product with code ' + code + ' successfully added', 'bg-success');
						res.redirect('back');
					}
				});
			});
	} else {
		if(req.files.photo.mimetype.indexOf('jpeg') ===  -1 && req.files.photo.mimetype.indexOf('png') === -1) {
			res.error('Image should be in JPEG, JPG or PNG format');
			res.redirect('back');
			return;
		}

		image.load(req.files.photo.path, function(err, results) {
			if(err && err.status === 400) {
				res.error('Image already exists');
				res.redirect('back');
				return;
			}

			if(err) return next(err);
			var tmp = [code];
			Array.prototype.push.apply(tmp, results); // merge two arrays
			images = [tmp];

			async.series([
				function(callback) {
					Product.save({
						code: code,
						category: category,
						title:title,
						desc: desc,
						info: info,
						price: price
					}, callback);
				},
				function(callback) {
					DataSheet.save(dataSheet, callback);
				},
				function(callback) {
					Image.save(images, callback);
				}
			], function(err) {
				if(err && err.code === 'ER_DUP_ENTRY') {
					res.error('Product with ' + code + ' already exists');
					res.redirect('back');
				} else if(err) {
					return next(err);
				} else {
					res.message('Product with code ' + code + ' successfully added', 'bg-success');
					res.redirect('back');
				}
			});
		});
	}		
};
