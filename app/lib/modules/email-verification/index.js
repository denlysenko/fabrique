var models = require('../../../models'),
		nodemailer = require('nodemailer'),
		crypto = require('crypto'),
		async = require('async'),
		HttpError = require('../errors').HttpError,
		config = require('../../../../config');

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
			models.tokens.create({
        email: email,
        token: token,
        expires: new Date(Date.now() + 60000) // 1hour
      })
          .then(function() {
            callback(null, token);
          })
          .catch(function(err) {
            callback(err);
          });
		},
		function(token, callback) {
			var tmpLink = link + '/email-verification/' + token;
			transporter.sendMail({
				from: 'noreply@fabrique.com',
				to: email,
				subject: 'Email Verification',
				html: 'You are trying to register at Fabrique. Please, confirm your email address by clicking on the following link <a href="' + tmpLink + '">' + tmpLink + '</a>. This link will be valid for 1 hour.'
			});
			callback();
		}
	], callback)
};

exports.confirm = function(token, callback) {
	async.waterfall([
		function(callback) {
			models.tokens.findOne({
        where: {
          token: token
        }
      })
          .then(function(result) {
            if(!result) {
              return callback(new HttpError(404, 'Page Not Found'));
            }
            callback(null, result);
          })
          .catch(function(err) {
            callback(err);
          });
		},
		function(result, callback) {
			transporter.sendMail({
				from: '',
				to: result.email,
				subject: 'Registration Confirmation',
				html: 'Thank you for registration at Fabrique.'
			});
			callback(null, result.email)
		},
		function(email, callback) {
			models.client.update({
        verified: 1
      }, {
        where: {email: email}
      })
          .then(function() {
            callback();
          })
          .catch(function(err) {
            callback(err);
          })
		}
	], callback);
};

