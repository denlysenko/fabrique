var lwip = require('lwip'),
		fs = require('fs'),
		normalize = require('path').normalize,
		async = require('async'),
		config = require('../../../../config'),
		HttpError = require('../errors').HttpError;

exports.load = function(image, callback) {
	lwip.open(image, function(err, img) {
		if(err) return callback(err);
		async.series([
			function(callback) {
				img.resize(config.get('images:width'), config.get('images:height'), function(err, img) {
					if(err) return callback(err);
					var pathTmp = image.replace('tmp', '');
					var pathImg = normalize(__dirname + '../../../../../public/images/products' + pathTmp);
					fs.stat(pathImg, function(err, stat) {
						if(!err) return callback(new HttpError(400, 'Bad Request'));
						img.writeFile(pathImg, function(err) {
							if(err) return callback(err);
							var index = pathImg.indexOf('images');
							pathImg = pathImg.slice(index - 1);
							callback(null, pathImg);
						});
					});
				});
			},
			function(callback) {
				img.resize(config.get('thumbs:width'),config.get('thumbs:height'), function(err, img) {
					if(err) return callback(err);
					var pathTmp = image.replace('tmp', '');
					var pathImg = normalize(__dirname + '../../../../../public/images/thumbs' + pathTmp);
					fs.stat(pathImg, function(err, stat) {
						if(!err) return callback(new HttpError(400, 'Bad Request'));
						img.writeFile(pathImg, function(err) {
							if(err) return callback(err);
							var index = pathImg.indexOf('images');
							pathImg = pathImg.slice(index - 1);
							callback(null, pathImg);
						});
					});
				});
			}
		], function(err, results) {
			try {
				fs.unlinkSync(image);
			} catch(e) {
				return callback(e);
			}
			if(err) return callback(err);
			callback(null, results);
		});
	});
};

exports.remove = function(img, callback) {
	async.each(img, function(row, cb) {
		try {
      var path = normalize(__dirname + '../../../../../public' + row);
      fs.unlinkSync(path);
			cb(null);
		} catch(err) {
			return cb(err);
		}	
	}, function(err) {
		if(err) return callback(err);
		callback();
	});
};