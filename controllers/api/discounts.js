var Discount = require('../../models/discounts'),
		validator = require('validator');

exports.add = function(req, res, next) {
	var number = +req.body.number,
			discount = +req.body.discount;

	if(!validator.matches(number, /\d{8}/)) {
		res.error('Number must contain 8 numbers', 'bg-danger');
		return res.redirect('back');
	}		

	if(!validator.isInt(discount)) {
		res.error('Discount must be an integer', 'bg-danger');
		return res.redirect('back');
	}
			
	Discount.save({number: number, discount: discount}, function(err) {
		if(err && err.code === 'ER_DUP_ENTRY') {
			res.error('Card with number ' + number +' is already exists', 'bg-danger');
			return res.redirect('back');
		}
		if(err) return next(err);

		res.message('Card with number ' + number + ' successfully added!', 'bg-success');
		res.redirect('back');
	});		
};

exports.remove = function(req, res, next) {
	var number = req.body.number;

	if(!validator.matches(number, /\d{8}/)) {
		res.error('Number must contain 8 numbers', 'bg-danger');
		return res.redirect('back');
	}		

	Discount.remove(number, function(err, results) {
		if(results.affectedRows === 0) {
			res.error('Card with number ' + number + ' does not exist');
			return res.redirect('back');
		}

		if(err) return next(err);
		res.message('Card with number ' + number + ' successfully removed');
		res.redirect('back');
	});
};