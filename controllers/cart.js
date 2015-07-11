var Product = require('../models/products'),
		validator = require('validator'),
		HttpError = require('../error').HttpError,
		Order = require('../models/orders'),
		Discount = require('../models/discounts'),
		config = require('../config'),
		nodemailer = require('nodemailer');

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});

var transporter = nodemailer.createTransport({
  service: config.get('mailer:service'),
  auth: config.get('mailer:auth')
});	

exports.show = function(req, res, next) {
	if(req.session.basket && req.session.basket.length) {
		var basket = req.session.basket;
		var codes = [], i, len = basket.length;
		for(i = 0; i < len; i++) {
			var item = basket[i];
			codes.push(item.code);
		}
		Product.findForCart(codes, function(err, rows) {
			if(err) return next(err);
			rows.map(function(row) {
				for(i = 0; i < len; i++) {
					if(row.code === basket[i].code) {
						row.qty = basket[i].qty;
					}
				}
			});
			res.render('cart', {
				title: 'Your basket',
				products: rows,
				page: req.path
			});
		});
	} else {
		res.render('cart', {
			title: 'Your basket',
			products: null,
			page: req.path
		});
	}
};

exports.checkout = function(req, res) {
	res.render('blocks/checkout');
};

exports.sendOrder = function(req, res, next) {
	var firstName = req.body.firstName,
			lastName = req.body.lastName,
			email = req.body.email,
			phone = req.body['tel-num'],
			payment = req.body.payment,
			address = req.body.address,
			code = req.body.code,
			title = req.body.title,
			price = req.body.price,
			currency = req.body.currency,
			qty = req.body.quantity,
			discount = req.body.discount || 'none',
			order = [],
			products = [];
			
	if(!validator.isEmail(email)) return next(new HttpError(403, 'Incorrect Email'));	
	if(!validator.matches(phone, /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)) return next(new HttpError(403, 'Incorrect phone number'));

	if(Array.isArray(title)) {
		var i, len = title.length, data = [];
		for(i = 0; i < len; i++) {
			order.push([email, title[i], +qty[i], +price[i], currency[i]]);
			products.push({code: code[i], title: title[i], price: price[i], currency: currency[i], qty: qty[i]});
		}
	} else {
		order.push([email, title, +qty, +price, currency]);
		products.push({code: code, title: title, price: price, currency: currency, qty: qty});
	}	

	var client = {
		name: firstName,
		surname: lastName,
		email: email,
		phone: phone,
		payment: payment,
		address: address,
		discount: discount
	};

	Order.save(order, function(err) {
		if(err) return next(err);
		req.session.basket = [];
		req.session.qty = 0;
		res.message('Your order is accepted. Our manager will contact you!', 'bg-success');
		res.render('emails/order', {client: client, products: products}, function(err, html) {
			if(err) return next(err);
			transporter.sendMail({
				to: '***',
		    from: '',
		    subject: 'New Order',
		    html: html
  		});
		});
		res.end();
	});
};

exports.checkDiscount = function(req, res, next) {
	var number = req.body.discount;
	Discount.find(number, function(err, rows) {
		if(err) return next(err);
		if(!rows.length) {
			res.error('Card Not Found', 'bg-danger');
			return res.redirect('back');
		}
		
		res.message('Your discount is ' + rows[0].discount + ' %', 'bg-success');
		res.redirect('back');
	});
};

exports.update = function(req, res, next) {
	var number = req.body.number;

	Discount.find(number, function(err, rows) {
		if(err) return next(err);
		if(!rows.length) return next(new HttpError(404, 'Not Found'));
		res.end(rows[0].discount.toString());
	});
};
