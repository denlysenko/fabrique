var mysql = require('../lib/mysql'),
		async = require('async');

module.exports = {
	save: function(data, callback) {
		mysql.query('INSERT INTO products SET ?', data, callback);
	},
	update: function(product, code, callback) {
		mysql.query('UPDATE products SET ? WHERE code = ?', [product, code], callback);
	},
	remove: function(code, callback) {
		mysql.query('DELETE FROM products WHERE code = ?', [code], callback);
	},
	findByCode: function(code, callback) {
		mysql.query('SELECT * FROM products WHERE code = ?', [code], callback);
	},
	findByCategory: function(category, callback) {
		mysql.query('SELECT code, category, title, price FROM products WHERE category = ?', [category], callback);
	},
	findByTitle: function(title, callback) {
		mysql.query('SELECT * FROM products WHERE MATCH(title) AGAINST(?)', [title], callback);
	},
	findLast: function(num, callback) {
		mysql.query('SELECT * FROM products INNER JOIN images ON products.code=images.code GROUP BY products.code ORDER BY added DESC LIMIT ?', [num], callback);
	},
	findLastFromCategory: function(num, category, callback) {
		mysql.query('SELECT * FROM products p, images i WHERE p.category = ? AND p.code = i.code GROUP BY p.code ORDER BY added DESC LIMIT ?', [category, num], callback);
	},
	findMostViewed: function(num, callback) {
		mysql.query('SELECT * FROM products INNER JOIN images ON products.code=images.code GROUP BY products.code ORDER BY views DESC LIMIT ?', [num], callback);
	},
	findMostViewedByCategory: function(num, category, callback) {
		mysql.query('SELECT * FROM products p, images i WHERE p.category = ? AND p.code = i.code GROUP BY p.code ORDER BY views DESC LIMIT ?', [category, num], callback);
	},
	findForCart: function(codes, callback) {
			mysql.query('SELECT * FROM products p, images i WHERE p.code IN ? AND p.code = i.code GROUP BY p.code ORDER BY title', [[codes]], callback);
	}
};