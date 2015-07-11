var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO reviews SET ?', [data], callback);
	},
	find: function(code, callback) {
		mysql.query('SELECT name, rate, review, DATE_FORMAT(added, "%d/%m/%Y") AS added, code FROM reviews WHERE code = ? ORDER BY added', [code], callback);
	},
	removeAll: function(code, callback) {
		mysql.query('DELETE FROM reviews WHERE code = ?', [code], callback);
	}
};