'use strict';

var discounts = require('../controllers/discounts'),
    loadManager = require('../lib/middlewares/loadManager'),
    checkManager = require('../lib/middlewares/checkManager');

module.exports = function(app) {

  app.route('/api/discounts')
      .get(loadManager, discounts.index)
      .post(checkManager, discounts.add)
      .delete(checkManager, discounts.remove);
};