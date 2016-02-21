var path = require('path');







exports.sale = function(req, res) {
	res.render('app/products/search', {
		title: 'Search Products',
		page: 'sale'
	});
};



