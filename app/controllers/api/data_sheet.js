var DataSheet = require('../../models/data_sheet')

exports.remove = function(req, res, next) {
	var id = req.params.id;
	DataSheet.findByIdAndRemove(id, function(err) {
		if(err) return next(err);
		res.message('Feature successfully removed', 'bg-success');
		res.end();
	});
};