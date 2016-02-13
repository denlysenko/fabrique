var path = require('path');



exports.addProduct = function(req, res) {
	res.render('app/products/add', {
		title: 'Add Product',
	});
};

exports.editProduct = function(req, res) {
	res.render('app/products/search', {
		title: 'Edit Product',
		page: 'edit'
	});
};

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



