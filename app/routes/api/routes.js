var router = require('express').Router(),
		main = require('.././api/main'),
		manager = require('.././api/managers'),
		slider = require('.././api/slider'),
		sale = require('.././api/sale'),
		discount = require('.././api/discounts'),
		loadManager = require('.././loadManager'),
		checkManager = require('.././checkManager');

router.use(loadManager);		

router.get('/', main.index);
router.route('/authenticate')
		.get(main.index)
		.post(manager.authenticate);
router.get('/cancel', main.cancel);
router.get('/logout', main.logout);		

router.use(checkManager);

router.route('/manager')
		.get(main.manager)
		.post(manager.add)
		.delete(manager.remove)
		.put(manager.update);

router.route('/products/add')
		.get(main.addProduct)
		.post(require('.././products/add'));
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

router.route('/discounts')
		.get(main.discounts)
		.post(discount.add)
		.delete(discount.remove);

module.exports = router;