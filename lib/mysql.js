var mysql = require('mysql'),
		config = require('../config');

var connection = 	mysql.createConnection(config.get('mysql'));

module.exports = connection;		