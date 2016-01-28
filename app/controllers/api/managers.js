var Manager = require('../../models/managers'),
		validator = require('validator');

exports.authenticate = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.passwd;
	if(!validator.isAlphanumeric(login)) {
		res.error('Login should contain only letter or numbers');
		res.redirect('back');
	} else if(!validator.isAlphanumeric(password)) {
		res.error('Password should contain only letter or numbers');
		res.redirect('back');
	} else {
		login = login.trim();
		password = password.trim();
		Manager.authenticate(login, password, function(err) {
			if(err && err.status === 404) {
				res.error('User ' + login + ' not found');
				res.redirect('back');
			} else if(err && err.status === 403) {
				res.error('Invalid password');
				res.redirect('back');
			} else if(err) {
				return next(err);
			} else {
				req.session.manager = login;
				res.render('api/index', {
					title: 'Admin Panel',
					manager: login
				});
			}
		});
	}
};		

exports.add = function(req, res, next) {
	var login = req.body.name;
	var password = req.body.passwd;
	if(!validator.isAlphanumeric(login)) {
		res.error('Login should contain only letter or numbers');
		res.redirect('back');
	} else if(!validator.isAlphanumeric(password)) {
		res.error('Password should contain only letter or numbers');
		res.redirect('back');
	} else {
		login = login.trim();
		password = password.trim();
		var manager = new Manager(login, password);
		manager.save(function(err) {
			if(err && err.code === 'ER_DUP_ENTRY') {
				res.error(login + ' already exists');
				res.redirect('back');
			} else if(err) {
				return next(err);
			} else {
				res.message(login + ' successfully saved', 'bg-success');
				res.redirect('back');
			}
		});
	}
};

exports.update = function(req, res, next) {
	var login = req.session.uid;
	var name = req.body.name;
	var password = req.body.passwd;
	if(!validator.isAlphanumeric(name)) {
		res.error('Login should contain only letter or numbers');
		res.redirect('back');
	} else if(!validator.isAlphanumeric(password)) {
		res.error('Password should contain only letter or numbers');
		res.redirect('back');
	} else {
		name = name.trim();
		password = password.trim(); 
		Manager.update(login, name, password, function(err) {
			if(err && err.code === 'ER_DUP_ENTRY') {
				res.error(name + ' already exists');
				res.redirect('back');
			} else if(err) {
				return next(err);
			} else {
				res.message(name + ' successfully saved', 'bg-success');
				res.redirect('back');
			}
		});
	}
};

exports.remove = function(req, res, next) {
	var login = req.body.name;
	if(!validator.isAlphanumeric(login)) {
		res.error('Login should contain only letter or numbers');
		res.redirect('back');
	} else {
		login = login.trim();
		Manager.remove(login, function(err) {
			if(err && err.status === 404) {
				res.error('User ' + login + ' not found');
				res.redirect('back');
			} else if(err) {
				return next(err);
			} else {
				res.message(login + ' successfully removed', 'bg-success');
				res.redirect('back');
			}
		});
	}
};		
