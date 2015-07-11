var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO orders (email, title, qty, price, currency) VALUES ?', [data], callback);
	},
	remove: function(email, callback) {
		mysql.query('DELETE FROM orders WHERE email = ?', [email], callback);
	},
	find: function(email, callback) {
		mysql.query('SELECT title, qty, price, currency, DATE_FORMAT(date, "%d/%m/%Y") AS date FROM orders WHERE email = ?  ORDER BY date', [email], callback);
	}
};