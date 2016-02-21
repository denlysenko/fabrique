/*var router = require('express').Router(),
		product = require('./products'),
		checkAuth = require('./checkAuth');

router.get('/:code', product.show);

router.post('/review/:code', product.addReview);

router.route('/basket/:code')
		.post(checkAuth, product.addToBasket)
		.delete(product.removeFromBasket);


module.exports = router;*/
var manager = require('../controllers/products/manager');

module.exports = function(app) {

	app.route('/api/products/add')
			.get(manager.addProduct)
			.post(manager.saveProduct);

	app.route('/api/products/edit')
			.get(manager.showSearchForm)
			//.post(manager.saveProduct);

  app.route('/api/products/search')
      .get(manager.searchProduct);

  app.route('/api/products/edit/:code')
      .get(manager.showProduct)
			.put(manager.updateProduct);

	app.route('/api/products/delete_image/:id').delete(manager.removeImage);

	app.route('/api/products/delete_feature/:id').delete(manager.removeDataSheet);
};