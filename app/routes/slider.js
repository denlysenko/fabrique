'use strict';

var slider = require('../controllers/slider'),
    checkManager = require('../lib/middlewares/checkManager');

module.exports = function(app) {

  app.route('/api/slider')
      .get(checkManager, slider.showSearchForm);

  app.route('/api/slider/:code')
      .get(checkManager, slider.showProduct)
      .post(checkManager, slider.addProduct);

  app.route('/api/slider_remove/:id?')
      .get(checkManager, slider.showRemoveForm)
      .delete(checkManager, slider.removeFromSlider);
};