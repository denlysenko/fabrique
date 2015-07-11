var mysql = require('../lib/mysql');

module.exports = {
	save: function(images, callback) {
		mysql.query('INSERT INTO images (code, image, thumb) VALUES ?', [images], callback);
	},
	findById: function(id, callback) {
		mysql.query('SELECT * FROM images WHERE id = ?', [id], callback);
	},
	findByCode: function(code, callback) {
		mysql.query('SELECT * FROM images WHERE code = ?', [code], callback);
	},
	findByIdAndRemove: function(id, callback) {
		mysql.query('DELETE FROM images WHERE id = ?', [id], callback);
	},
	findByCodeAndRemove: function(code, callback) {
		mysql.query('DELETE FROM images WHERE code = ?', [code], callback);
	}
};