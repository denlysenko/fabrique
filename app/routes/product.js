'use strict';

var manager = require('../controllers/products/manager'),
    checkManager = require('../lib/middlewares/checkManager');

module.exports = function(app) {

	app.route('/api/products/add')
			.get(checkManager, manager.addProduct)
			.post(checkManager, manager.saveProduct);

	app.route('/api/products/edit')
			.get(checkManager, manager.showSearchForm);

  app.route('/api/products/search')
      .get(checkManager, manager.searchProduct);

  app.route('/api/products/edit/:code')
      .get(checkManager, manager.showProduct)
			.put(checkManager, manager.updateProduct);

	app.route('/api/products/remove/:code')
			.delete(checkManager, manager.removeProduct);

	app.route('/api/products/delete_image/:id').delete(checkManager, manager.removeImage);

	app.route('/api/products/delete_feature/:id').delete(checkManager, manager.removeDataSheet);
};