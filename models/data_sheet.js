var mysql = require('../lib/mysql');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO data_sheet (code, feature, characteristic) VALUES ?', [data], callback);
	},
	findByCode: function(code, callback) {
		mysql.query('SELECT * FROM data_sheet WHERE code = ?', [code], callback);
	},
	findByIdAndRemove: function(id, callback) {
		mysql.query('DELETE FROM data_sheet WHERE id = ?', [id], callback);
	},
	findByCodeAndRemove: function(code, callback) {
		mysql.query('DELETE FROM data_sheet WHERE code = ?', [code], callback);
	}
};