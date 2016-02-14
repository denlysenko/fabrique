var manager = require('../controllers/managers'),
    loadManager = require('../lib/middlewares/loadManager'),
    checkManager = require('../lib/middlewares/checkManager');

module.exports = function(app) {

  app.route('/api').get(loadManager, manager.index);
  app.route('/api/authenticate')
      .get(loadManager, manager.index)
      .post(manager.authenticate);

  app.route('/api/manager')
      .get(checkManager, manager.manager)
      .post(checkManager, manager.create)
      .delete(checkManager, manager.remove)
      .put(checkManager, manager.update);

  app.get('/api/cancel', manager.cancel);
  app.get('/api/logout', manager.logout);
};
/*var router = require('express').Router(),
		main = require('../../controllers/api/main'),
		manager = require('../../controllers/api/managers'),
		slider = require('../../controllers/api/slider'),
		sale = require('../../controllers/api/sale'),
		discount = require('../../controllers/api/discounts')



router.get('/products/edit', main.editProduct);
router.route('/products/edit/:code')
		.get(require('.././products/edit'))
		.put(require('.././products/update'));
router.get('/products/search', require('.././products/search'));
router.delete('/products/delete_image/:id', require('.././api/images').remove);
router.delete('/products/delete_feature/:id', require('.././api/data_sheet').remove);
router.delete('/products/remove/:code', require('.././products/remove'));

router.get('/slider/remove', slider.sliderRemove);
router.delete('/slider/remove/:id', slider.removeFromSlider);
router.get('/slider', main.slider);
router.route('/slider/:code')
		.get(slider.slider)
		.post(slider.addToSlider);	

router.get('/sale/remove', sale.saleRemove);
router.delete('/sale/remove/:id', sale.removeFromSale);			
router.get('/sale', main.sale);
router.route('/sale/:code')
		.get(sale.sale)
		.post(sale.addToSale);


module.exports = router;*/