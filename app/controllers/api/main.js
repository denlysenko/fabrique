var path = require('path');

exports.index = function(req, res) {
	if(req.session.manager) {
		res.render('api/index', {
			title: 'Admin Panel',
		});
	} else {
		res.render('api/authentication', {
			title: 'Authentication'
		});
	}
};

exports.manager = function(req, res) {
	res.render('api/manager', {
		title: 'Managers',
	});
};

exports.addProduct = function(req, res) {
	res.render('api/products/add', {
		title: 'Add Product',
	});
};

exports.editProduct = function(req, res) {
	res.render('api/products/search', {
		title: 'Edit Product',
		page: 'edit'
	});
};

exports.slider = function(req, res) {
	res.render('api/products/search', {
		title: 'Search Products',
		page: 'slider'
	});
};

exports.sale = function(req, res) {
	res.render('api/products/search', {
		title: 'Search Products',
		page: 'sale'
	});
};

exports.discounts = function(req, res) {
	res.render('api/discounts', {
		title: 'Discount Cards',
	});
};

exports.cancel = function(req, res) {
	res.redirect('/');
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
}