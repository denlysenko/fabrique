var path = require('path');





exports.slider = function(req, res) {
	res.render('app/products/search', {
		title: 'Search Products',
		page: 'slider'
	});
};

exports.sale = function(req, res) {
	res.render('app/products/search', {
		title: 'Search Products',
		page: 'sale'
	});
};



