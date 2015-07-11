var mysql = require('../lib/mysql'),
		nodemailer = require('nodemailer'),
		crypto = require('crypto'),
		async = require('async'),
		HttpError = require('../error').HttpError,
		Client = require('../models/clients'),
		config = require('../config');

var transporter = nodemailer.createTransport({
  service: config.get('mailer:service'),
  auth: config.get('mailer:auth')
});	

exports.sendVerifyEmail = function(email, link, callback) {
	async.waterfall([
		function(callback) {
			crypto.randomBytes(48, function(err, buf) {
				if(err) return callback(err);
			  var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
				callback(null, token);
			});
		},
		function(token, callback) {
			mysql.query('INSERT INTO tokens (email, token, expires) VALUES (?,?, TIMESTAMPADD(HOUR, 2, NOW()))', [email, token], function(err) {
				if(err) return callback(err);
				callback(null, token);
			});
		},
		function(token, callback) {
			var tmpLink = link + '/verify/' + token;
			transporter.sendMail({
				from: 'donotreply@fabrique.me',
				to: email,
				subject: 'Email Verification',
				html: 'You are trying to register at Fabrique. Please, confirm your email address by clicking on the following link <a href="' + tmpLink + '">' + tmpLink + '</a>. This link will be valid for 2 hours.'
			});
			callback();
		}
	], callback)
};

exports.confirm = function(token, callback) {
	async.waterfall([
		function(callback) {
			mysql.query('SELECT email, token FROM tokens WHERE token = ?', [token], function(err, rows) {
				if(err) return callback(err);
				if(!rows.length) return callback(new HttpError(404, 'Page Not Found'));
				callback(null, rows);
			});
		},
		function(rows, callback) {
			transporter.sendMail({
				from: 'donotreply@fabrique.me',
				to: rows[0].email,
				subject: 'Registration Confirmation',
				html: 'Thank you for registration at Fabrique.'
			});
			callback(null, rows[0].email)
		},
		function(email, callback) {
			Client.update(email, {verified: 1}, callback)
		}
	], callback);
};

