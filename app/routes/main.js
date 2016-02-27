'use strict';

var main = require('../controllers/main'),
    loadSlider = require('../lib/middlewares/loadSlider'),
    loadLast = require('../lib/middlewares/loadLast'),
    loadMostViewed = require('../lib/middlewares/loadMostViewed');

module.exports = function(app) {
  app.get('/', loadSlider, loadLast, loadMostViewed, main.index);
};

//product = require('./products'),
//user = require('./users'),
//cart = require('./cart'),
//checkAuth = require('./checkAuth'),
//loadUser = require('./loadUser');

//router.use(loadUser);
//router.use(require('./loadBasket'));

//router.get('/switch/:currency', home.switchCurrency);
//router.get('/products/:category', product.category);
//router.get('/new/:category', product.new);
//router.get('/sale', product.sale);
//
//router.route('/contact')
//		.get(home.contactForm)
//		.post(home.submitMessage);
//
//router.route('/subscribe')
//		.get(user.subscription)
//		.post(user.subscribe);
//

//router.route('/wishlist/:code?')
//		.get(checkAuth, product.wishlist)
//		.post(checkAuth, product.addToWishlist)
//		.delete(product.removeFromWishlist);
//
//router.get('/cart', checkAuth, cart.show);
//router.get('/cart/checkout', checkAuth, cart.checkout);
//router.post('/cart/check_discount', cart.checkDiscount);
//router.post('/cart/send_order', cart.sendOrder);
//router.post('/cart/update', cart.update);
//
//router.get('/order_history', checkAuth, user.orders);
//
//router.get('/delivery', home.delivery);
//router.get('/returns', home.returns);
//router.get('/terms', home.terms);
//router.get('/privacy', home.privacy);
//router.get('/about', home.about);
//
//router.get('/FAQ', home.faq);
//
//router.get('/back', home.back);
//
//router.get('/search', home.search);

//module.exports = router;
