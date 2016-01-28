var nodemailer = require('nodemailer'),
		config = require('../config'),
		HttpError = require('../errors').HttpError,
		validator = require('validator'),
		url = require('url'),
		qs = require('querystring'),
		Product = require('../models/products');

var transporter = nodemailer.createTransport({
  service: config.get('mailer:service'),
  auth: config.get('mailer:auth')
});	

exports.index = function(req, res, next) {
	res.render('index', {title: 'Fabrique Home Page', page: req.path});
};

exports.switchCurrency = function(req, res, next) {
	var currency = req.params.currency;
	switch(currency) {
		case 'GBP':
			req.session.rate = req.session.rates['GBP'];
			req.session.currency = '£';
			break;
		case 'USD':
			req.session.rate = req.session.rates['GBPUSD'];
			req.session.currency = '$';
			break;
		case 'EUR':
			req.session.rate = req.session.rates['GBPEUR'];
			req.session.currency = '€';
			break;		
	}
	res.end();
};

exports.contactForm = function(req, res, next) {
	res.render('contact', {
		title: 'Contact us',
		page: req.path
	});
};

exports.submitMessage = function(req, res, next) {
	var name = req.body.name,
			lastName = req.body['last-name'],
			email = req.body.email,
			phone = req.body['tel-num'],
			accNumber = req.body['acc-number'],
			message = req.body.message,
			subscribe = req.body.subscribe;

	if(!validator.isEmail(email)) return res.status(403).json(new HttpError(403, 'Please, type correct email'));		

	transporter.sendMail({
		from: email,
		to: 'denny.lysenko@gmail.com',
		subject: 'Email from ' + email,
		html: 'Name: ' + name + '<br>Last Name: ' + lastName + '<br>Phone: ' + phone + '<br>Acc-number: ' + accNumber + '<br>' + message
	}, function(err) {
		if(err) return next(err);
		if(subscribe) {
			Subscription.subscribe(email, function(err) {
				if(err && err.code === 'ER_DUP_ENTRY') { 
					return res.status(403).json(new HttpError(403, 'You have already subscribed'));
				}
				if(err) return next(err);
				res.send('Your message was successfully sent');
			});
		} else {
			res.send('Your message was successfully sent');
		}
	});
};

exports.delivery = function(req, res) {
	res.render('delivery', {
		title: 'Delivery',
		page: req.path
	});
};

exports.returns = function(req, res) {
	res.render('returns', {
		title: 'Returns',
		page: req.path
	});
};

exports.terms = function(req, res) {
	res.render('terms', {
		title: 'Terms And Conditions',
		page: req.path
	});
};

exports.privacy = function(req, res) {
	res.render('privacy', {
		title: 'Privacy Policy',
		page: req.path
	});
};

exports.about = function(req, res) {
	res.render('about', {
		title: 'About Us',
		page: req.path
	});
}; 

exports.faq = function(req, res) {
	res.render('faq', {
		title: 'FAQ',
		page: req.path
	});
}; 

exports.back = function(req, res) {
	res.redirect('back');
};

exports.search = function(req, res, next) {
	var q = url.parse(req.url).query,
			s = qs.parse(q);
	Product.findByTitle(s.search, function(err, rows) {
		if(err) return next(err);
		res.render('search', {
			title: 'Search Results',
			results: rows,
			page: req.path
		});
	});
};