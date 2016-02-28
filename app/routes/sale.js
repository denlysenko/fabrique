'use strict';

var sale = require('../controllers/sale'),
    checkManager = require('../lib/middlewares/checkManager');

module.exports = function(app) {

  app.route('/api/sale')
      .get(checkManager, sale.showSearchForm);

  app.route('/api/sale/:code')
      .get(checkManager, sale.showProduct)
      .post(checkManager, sale.addProduct);

  app.route('/api/sale_remove/:id?')
      .get(checkManager, sale.showRemoveForm)
      .delete(checkManager, sale.removeFromSale);
};