'use strict';

var main = require('../controllers/main'),
    auth = require('../controllers/auth'),
    product = require('../controllers/products/client'),
    loadUser = require('../lib/middlewares/loadUser'),
    loadBasket = require('../lib/middlewares/loadBasket'),
    loadSlider = require('../lib/middlewares/loadSlider'),
    loadLast = require('../lib/middlewares/loadLast'),
    loadMostViewed = require('../lib/middlewares/loadMostViewed'),
    checkAuth = require('../lib/middlewares/checkAuth');

module.exports = function(app) {
  app.use(loadUser);
  app.use(loadBasket);

  app.get('/', loadSlider, loadLast, loadMostViewed, main.index);
  app.get('/switch/:currency', main.switchCurrency);
  app.get('/products/:category', product.category);
  app.get('/new/:category', product.new);
  app.get('/product/:code', product.show);
  app.get('/sale', product.sale);

  app.route('/wishlist/:code?')
      .get(checkAuth, product.wishlist)
      .post(checkAuth, product.addToWishlist)
      .delete(product.removeFromWishlist);


  app.route('/contact')
      .get(main.contactForm)
      .post(main.submitMessage);

  app.route('/subscribe')
      .get(auth.subscription)
      .post(auth.subscribe);

  app.post('/product/review/:code', product.addReview);

  app.get('/delivery', main.delivery);
  app.get('/returns', main.returns);
  app.get('/terms', main.terms);
  app.get('/privacy', main.privacy);
  app.get('/about', main.about);

  app.get('/FAQ', main.faq);

  app.get('/back', main.back);

  app.get('/search', main.search);
};


//router.get('/cart', checkAuth, cart.show);
//router.get('/cart/checkout', checkAuth, cart.checkout);
//router.post('/cart/check_discount', cart.checkDiscount);
//router.post('/cart/send_order', cart.sendOrder);
//router.post('/cart/update', cart.update);
//
//router.get('/order_history', checkAuth, user.orders);
//


//module.exports = router;
