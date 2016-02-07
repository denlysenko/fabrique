/*var router = require('express').Router(),
		product = require('./products'),
		checkAuth = require('./checkAuth');

router.get('/:code', product.show);

router.post('/review/:code', product.addReview);

router.route('/basket/:code')
		.post(checkAuth, product.addToBasket)
		.delete(product.removeFromBasket);


module.exports = router;*/

module.exports = function(app) {};