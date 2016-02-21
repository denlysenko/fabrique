'use strict';

var sale = require('../controllers/sale');

module.exports = function(app) {

  app.route('/api/sale')
      .get(sale.showSearchForm);

  app.route('/api/sale/:code')
      .get(sale.showProduct)
      .post(sale.addProduct);

  app.route('/api/sale_remove/:id?')
      .get(sale.showRemoveForm)
      .delete(sale.removeFromSale);
};