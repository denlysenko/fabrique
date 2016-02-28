'use strict';

var cart = require('../controllers/cart'),
    checkAuth = require('../lib/middlewares/checkAuth');

module.exports = function(app) {
  app.get('/cart', checkAuth, cart.show);
  app.get('/cart/checkout', checkAuth, cart.checkout);
  app.post('/cart/check_discount', checkAuth, cart.checkDiscount);
  app.post('/cart/send_order', checkAuth, cart.sendOrder);
  app.post('/cart/update', checkAuth, cart.update);
};