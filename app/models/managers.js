var mysql = require('../lib/mysql'),
		crypto = require('crypto'),
		HttpError = require('../errors').HttpError;

function encryptPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

function checkPassword(password, salt, hashedPassword) {
	return hashedPassword === encryptPassword(password, salt);
};

var Manager = function(login, password) {
	this.login = login;
	this.salt = Math.random() + '';
	this.hashedPassword = encryptPassword(password, this.salt)
};

Manager.prototype.save = function(callback) {
	mysql.query('INSERT INTO managers SET ?', this, function(err) {
		if(err) return callback(err);
		callback();
	});
};

Manager.remove = function(login, callback) {
	mysql.query('DELETE FROM managers WHERE login = ?', [login], function(err, result) {
		if(err) return callback(err);
		if(result.affectedRows === 0) return callback(new HttpError(404, 'User Not Found'));
		callback();
	});
};

Manager.authenticate = function(login, password, callback) {
	mysql.query('SELECT salt, hashedPassword FROM managers WHERE login = ?', [login], function(err, rows) {
		if(err) return callback(err);
		if(!rows.length) return callback(new HttpError(404, 'User Not Found'));
		if(!checkPassword(password, rows[0].salt, rows[0].hashedPassword)) return callback(new HttpError(403, 'Invalid Password'));
		callback();
	});
};

Manager.update = function(login, newLogin, newPassword, callback) {
	var salt = Math.random() + '',
			hashedPassword = encryptPassword(newPassword, salt);
	var update = {
		login: newLogin,
		salt: salt,
		hashedPassword: hashedPassword
	};
	mysql.query('UPDATE managers SET ? WHERE login = ?', [update, login], function(err) {
		if(err) return callback(err);
		callback();
	});
};

module.exports = Manager;