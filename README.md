# fabrique e-commerce made on express.js and mysql

Internet shop is made on Express.js. The template engine - EJS. Database - MySQL. Branch master contains version where ORM Sequelize.js used for DB manipulation. There is another branch, called mysql, where mysql driver for Node.js and SQL queries to DB are used. The application is made in MVC style. The admin's part implemented CRUD operations with goods. Implemented a system of authorization and authentication. Actions with goods other than browsing can be performed only by registered users. Registration is only after verification e-mail. To test the capacity of the registered user you can use the following account - login: user@name.com, password: username. Cart implemented using session. Switching rates implemented by the module REQUEST, and Yahoo Finance API. For section NEW PRODUCTS selected 4 recently added products and for the section FEATURED PRODUCTS - 4 most viewed from database. Number of views is incrementing after each view of the product page. Photos are downloaded from the forms with module MULTER, and then reduced to the desired dimensions using the module LWIP.

Front-end part is made on Bootstrap, jQuery, styles - using LESS. Form Validation - a module validator.js. The forms are sent via AJAX.

Link: http://fabrique-den2710.rhcloud.com/
