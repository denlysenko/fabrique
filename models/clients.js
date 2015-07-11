var mysql = require('../lib/mysql'),
		crypto = require('crypto'),
		HttpError = require('../error').HttpError;

function encryptPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

function checkPassword(password, salt, hashedPassword) {
	return hashedPassword === encryptPassword(password, salt);
};

var Client = function(data) {
	this.email = data.email;
	this.name = data.name;
	this.last_name = data.lastName;
	this.salt = Math.random() + '';
	this.hashed_password = encryptPassword(data.password, this.salt);
};

Client.prototype.save = function(callback) {
	mysql.query('INSERT INTO clients SET ?', this, callback);
};

Client.remove = function(email, callback) {
	mysql.query('DELETE FROM clients WHERE email = ?', [email], function(err, result) {
		if(err) return callback(err);
		if(result.affectedRows === 0) return callback(new HttpError(404, 'User Not Found'));
		callback();
	});
};

Client.authenticate = function(email, password, callback) {
	mysql.query('SELECT salt, hashed_password FROM clients WHERE email = ? AND verified = 1', [email], function(err, rows) {
		if(err) return callback(err);
		if(!rows.length) return callback(new HttpError(404, 'User Not Found'));
		if(!checkPassword(password, rows[0].salt, rows[0].hashed_password)) return callback(new HttpError(403, 'Invalid Password'));
		callback(null, rows[0]);
	});
};

Client.update = function(email, data, callback) {
	mysql.query('UPDATE clients SET ? WHERE email = ?', [data, email], callback);
};

Client.find = function(email, callback) {
	mysql.query('SELECT name, email, last_name FROM clients WHERE email = ?', [email], function(err, rows) {
		if(err) return callback(err);
		if(!rows.length) return callback(new HttpError(404, 'User Not Found'));
		callback(null, rows[0]);
	});
};

Client.updatePassword = function(email, password, callback) {
	var salt = Math.random() + '';
	var hashed_password = encryptPassword(password, salt)
	var data = {
		salt: salt,
		hashed_password: hashed_password 
	};
	Client.update(email, data, callback);
};

module.exports = Client;