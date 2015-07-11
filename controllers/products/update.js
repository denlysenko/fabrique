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
			id = req.params.code,
			dataSheet = [],
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

	if(feature && typeof feature === 'string') {
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
	} 

	if(feature && typeof feature !== 'string') {
		var tmp;

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

	var product = {
		code: code,
		category: category,
		title:title,
		desc: desc,
		info: info,
		price: price
	};

	if(req.files.photo) {
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
			Product.update(product, id, function(err) {
				if(err) return next(err);
				if(dataSheet.length) {
					DataSheet.save(dataSheet, function(err) {
						if(err) return next(err);
						Image.save(images, function(err) {
							if(err) return next(err);
							res.message('Product with code ' + code + ' successfully updated', 'bg-success');
							res.redirect('back');
						});
					});
				} else {
					Image.save(images, function(err) {
						if(err) return next(err);
						res.message('Product with code ' + code + ' successfully updated', 'bg-success');
						res.redirect('back');
					});
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
				Product.update(product, id, function(err) {
					if(err) return next(err);
					if(dataSheet.length) {
						DataSheet.save(dataSheet, function(err) {
							if(err) return next(err);
							Image.save(images, function(err) {
								if(err) return next(err);
								res.message('Product with code ' + code + ' successfully updated', 'bg-success');
								res.redirect('back');
							});
						});
					} else {
						Image.save(images, function(err) {
							if(err) return next(err);
							res.message('Product with code ' + code + ' successfully updated', 'bg-success');
							res.redirect('back');
						});
					}
				});
			});
		}	
	} else {
		Product.update(product, id, function(err) {
			if(err) return next(err);
			if(dataSheet.length) {
				DataSheet.save(dataSheet, function(err) {
					if(err) return next(err);
					res.message('Product with code ' + code + ' successfully updated', 'bg-success');
					res.redirect('back');
				});
			} else {
				res.message('Product with code ' + code + ' successfully updated', 'bg-success');
				res.redirect('back');
			}
		});
	}
};
