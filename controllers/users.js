var generatePassword = require('password-generator'),
		Client = require('../models/clients'),
		validator = require('validator'),
		HttpError = require('../error').HttpError,
		verifyEmail = require('../verify'),
		Subscription = require('../models/subscription'),
		Order = require('../models/orders'),
		Wishlist = require('../models/wishlist'),
		async = require('async');

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});		

exports.regForm = function(req, res, next) {
	res.render('register', {
		title: 'Register',
		page: req.path
	});
};

exports.securePassword = function(req, res) {
	var password = generatePassword(12, false);
	res.send(password);
};

exports.register = function(req, res, next) {
	var name = req.body.name,
			lastName = req.body['last-name'],
			email = req.body.email,
			password = req.body.passwd,
			subscription = req.body.subscription;

	if(!validator.isNonEmpty(name)) {
		return res.status(403).json(new HttpError(403, 'Name should be filled'));
	}		

	if(!validator.isNonEmpty(lastName)) {
		return res.status(403).json(new HttpError(403, 'Last Name should be filled'));
	}		

	if(!validator.isEmail(email)) {
		return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
	}		

	if(!validator.isNonEmpty(password)) {
		return res.status(403).json(new HttpError(403, 'Password should be filled'));
	}		

	name = name.trim();
	lastName = lastName.trim();
	email = email.trim();
	password = password.trim();

	var client = new Client({
		name: name,
		lastName: lastName,
		email: email,
		password: password
	});

	var link = req.protocol + '://' + req.get('host') + req.originalUrl;

	client.save(function(err) {
		if(err && err.code === 'ER_DUP_ENTRY') { 
			return res.status(403).json(new HttpError(403, 'User already exists'));
		}
		if(err) return next(err);

		verifyEmail.sendVerifyEmail(email, link, function(err) {
			if(err) return next(err);
			if(subscription) {
				Subscription.subscribe(email, function(err) {
					if(err && err.code === 'ER_DUP_ENTRY') { 
						return res.status(403).json(new HttpError(403, 'You have already subscribed'));
					}
					if(err) return next(err);
					res.send('We sent verification letter on your email. Please, confirm your email. Link valid 2 hours');
				});
			} else {
				res.send('We sent verification letter on your email. Please, confirm your email. Link valid 2 hours');
			}
		});
	});	
};

exports.confirmation = function(req, res, next) {
	var token = req.params.token;
	verifyEmail.confirm(token, function(err) {
		if(err) return next(err);
		res.message('Your Email has been activated. Please, log in.', 'bg-success');
		res.redirect('/login');
	});
};

exports.login = function(req, res, next) {
	res.render('login', {
		title: 'Log In',
		page: req.path
	});
};

exports.authenticate = function(req, res, next) {
	var email = req.body.email,
			password = req.body.passwd;

	if(!validator.isEmail(email)) {
		return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
	}		

	if(!validator.isNonEmpty(password)) {
		return res.status(403).json(new HttpError(403, 'Password should be filled'));
	}	

	email = email.trim();
	password = password.trim();

	Client.authenticate(email, password, function(err) { 
		if(err) return res.status(err.status).json(err);
		req.session.uid = email;
		res.send('User ' + email + ' successfully logged in');
	});		
};

exports.restore = function(req, res, next) {
	var email = req.body.email;
	Client.find(email, function(err) {
		if(err) return next(err);
		res.render('restore', {
			title: 'Restore password',
			page: req.path,
			email: email
		});
	});
};

exports.updatePassword = function(req, res, next) {
	var email = req.body.email,
			password = req.body.passwd;

	if(!validator.isEmail(email)) {
		return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
	}		

	if(!validator.isNonEmpty(password)) {
		return res.status(403).json(new HttpError(403, 'Password should be filled'));
	}	
	
	password = password.trim();

	Client.updatePassword(email, password, function(err) {
		if(err) return res.status(err.status).json(err);
		res.send('Your password was successfully updated');
	});		
};

exports.subscription = function(req, res, next) {
	res.render('subscription', {
		title: 'Newsletter Subscription',
		page: req.path
	});
};

exports.subscribe = function(req, res, next) {
	var email = req.body.email;

	if(!validator.isEmail(email)) {
		return res.status(403).json(new HttpError(403, 'Please, type correct email'));
	}

	Subscription.subscribe(email, function(err) {
		if(err && err.code === 'ER_DUP_ENTRY') { 
			return res.status(403).json(new HttpError(403, 'You have already subscribed'));
		}
		if(err) return next(err);
		res.send('You successfully subscribed to newsletter');
	});
};

exports.orders = function(req, res, next) {
	var email = req.session.uid;
	Order.find(email, function(err, rows) {
		if(err) return next(err);
		res.render('orders', {
			title: 'Your order history',
			orders: rows,
			page: req.path
		});
	});
};

exports.cancelAccount = function(req, res, next) {
	res.render('confirmation', {
		title: 'Confirmation Deletion'
	});
};

exports.removeAccount = function(req, res, next) {
	var email = req.session.uid;

	async.series([
		function(callback) {
			Client.remove(email, callback);
		},
		function(callback) {
			Order.remove(email, callback);
		},
		function(callback) {
			Wishlist.removeClient(email, callback);
		},
		function(callback) {
			Subscription.unsubscribe(email, callback);
		}
	], function(err) {
		if(err) return next(err);
		req.session.destroy();
		res.send('/');
	});
};

exports.logout = function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
};
