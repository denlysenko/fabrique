var Image = require('../../models/images'),
		image = require('../../images'),
		async = require('async');

exports.remove = function(req, res, next) {
	var id = req.params.id;
	async.series([
		function(callback) {
			Image.findById(id, function(err, images) {
				if(err) return next(err);
				callback(null, images)
			});
		},
		function(callback) {
			Image.findByIdAndRemove(id, callback);
		}
	], function(err, results) {
		if(err) return next(err);
		image.remove(results[0], function(err) {
			if(err) return next(err);
			res.message('Image successfully removed', 'bg-success');
			res.end();
		});
	});	
};