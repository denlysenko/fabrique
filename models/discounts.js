var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO discounts SET ?', [data], callback);
	},
	remove: function(number, callback) {
		mysql.query('DELETE FROM discounts WHERE number = ?', [number], callback);
	},
	find: function(number, callback) {
		mysql.query('SELECT * FROM discounts WHERE number = ?', [number], callback);
	}
};