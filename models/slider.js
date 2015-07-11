var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO slider SET ?', data, callback);
	},
	find: function(callback) {
		mysql.query('SELECT * FROM slider', callback);
	},
	remove: function(id, callback) {
		mysql.query('DELETE FROM slider WHERE id = ?', [id], callback);
	},
	removeAll: function(code, callback) {
		mysql.query('DELETE FROM slider WHERE code = ?', [code], callback);
	}
};