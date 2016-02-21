'use strict';

var slider = require('../controllers/slider');

module.exports = function(app) {

  app.route('/api/slider')
      .get(slider.showSearchForm);

  app.route('/api/slider/:code')
      .get(slider.showProduct)
      .post(slider.addProduct);

  app.route('/api/slider_remove/:id?')
      .get(slider.showRemoveForm)
      .delete(slider.removeFromSlider);
};