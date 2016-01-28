var mysql = require('../lib/mysql');

module.exports = {
	subscribe: function(email, callback) {
		mysql.query('INSERT INTO subscribers SET email = ?', [email], callback);
	},
	unsubscribe: function(email, callback) {
		mysql.query('DELETE FROM subscribers WHERE email = ?', [email], callback);
	}
};