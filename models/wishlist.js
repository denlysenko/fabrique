var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO wishlist SET ?', [data], callback);
	},
	remove: function(code, callback) {
		mysql.query('DELETE FROM wishlist WHERE code = ?', [code], callback);
	},
	find: function(email, callback) {
		mysql.query('SELECT * FROM products p, images i WHERE p.code IN (SELECT code FROM wishlist WHERE email = ?) AND p.code = i.code GROUP BY p.code', [email], callback)
	},
	removeClient: function(email, callback) {
		mysql.query('DELETE FROM wishlist WHERE email = ?', [email], callback);
	}
};