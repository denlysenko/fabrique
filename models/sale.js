var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO sale SET ?', data, callback);
	},
	findAll: function(callback) {
		mysql.query('SELECT * FROM sale', callback);
	},
	findById: function(id, callback) {
		mysql.query('SELECT * FROM sale WHERE id = ?', [id], callback);
	},
	find: function(callback) {
		mysql.query('SELECT * FROM products p, images i WHERE p.code IN (SELECT code FROM sale) AND p.code = i.code GROUP BY p.code', callback);
	},
	remove: function(id, callback) {
		mysql.query('DELETE FROM sale WHERE id = ? ', [id], callback);
	},
	removeAll: function(code, callback) {
		mysql.query('DELETE FROM sale WHERE code = ?', [code], callback);
	}
};