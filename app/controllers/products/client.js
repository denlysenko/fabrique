var models = require('../../models'),
		async = require('async'),
		config = require('../../../config'),
		HttpError = require('../../lib/modules/errors').HttpError,
		validator = require('validator');

validator.extend('isNonEmpty', function(str) {
	return str !== '';
});	

exports.show = function(req, res, next) {
	var code = req.params.code;

  async.waterfall([
      function(callback) {
        models.product.findOne({
          where: {
            productCode: code
          },
          include: [
            {model: models.image, as: 'images'},
            {model: models.dataSheet, as: 'dataSheet'},
            {model: models.review, as: 'reviews'}
          ]
        })
            .then(function(product) {
              callback(null, product);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(product, callback) {
        product.views = ++product.views;
        product.save()
            .then(function(product) {
              callback(null, product);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(product, callback) {
        models.product.findAll({
          where: {
            category: product.category
          },
          order: [
              ['views', 'DESC']
          ],
          limit: 3,
          include: [
            {model: models.image, as: 'images'}
          ]
        })
            .then(function(related) {
              callback(null, product, related);
            })
            .catch(function(err) {
              callback(err);
            });
      }
  ], function(err, product, related) {
    if(err) return next(err);
    res.render('product', {
      title: product.title,
      product: product,
      related: related,
      page: req.path
    });
  });
};

exports.category = function(req, res, next) {
	var category = req.params.category;

  models.product.findAll({
    where: {
      category: category
    },
    order: [
        ['views', 'DESC']
    ],
    include: [
      {model: models.image, as: 'images'}
    ]
  })
      .then(function(rows) {
        if(!rows.length) {
          return next(new HttpError(404, 'Category Not Found'));
        }
        category = category.charAt(0).toUpperCase() + category.slice(1);
        res.render('products', {
          title: category,
          products: rows,
          page: req.path
        });
      })
      .catch(function(err) {
        next(err);
      });
};

exports.new = function(req, res, next) {
	var category = req.params.category;

  models.product.findAll({
    where: {
      category: category
    },
    order: [
      ['views', 'DESC']
    ],
    limit: 10,
    include: [
      {model: models.image, as: 'images'}
    ]
  })
      .then(function(rows) {
        if(!rows.length) {
          return next(new HttpError(404, 'Category Not Found'));
        }
        category = category.charAt(0).toUpperCase() + category.slice(1);
        res.render('products', {
          title: category,
          products: rows,
          page: req.path
        });
      })
      .catch(function(err) {
        next(err);
      });
};

exports.sale = function(req, res, next) {
	models.sale.findAll({
    include: [
      {model: models.product}
    ]
  })
      .then(function(rows) {
        res.render('products', {
          title: 'Sale',
          products: rows,
          page: req.path
        });
      })
      .catch(function(err) {
        next(err);
      });
};

exports.wishlist = function(req, res, next) {
	var email = req.session.uid;

  async.waterfall([
      function(callback) {
        models.client.findOne({
          where: {
            email: email
          }
        })
            .then(function(client) {
              callback(null, client);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(client, callback) {
        models.wishlist.findAll({
          where: {
            clientId: client.clientId
          },
          include: [
            {
              model: models.product,
              include: [
                {model: models.image, as: 'images'}
              ]
            }
          ]
        })
            .then(function(rows) {
              callback(null, rows);
            })
            .catch(function(err) {
              callback(err);
            })
      }
  ], function(err, rows) {
    if(err) {
      console.log(err);
      return next(err);
    }
    var products = rows.map(function(row) {
      return row.product;
    });

    res.render('products', {
      title: 'Wishlist',
      products: products,
      page: req.path
    });
  });
};

exports.addToWishlist = function(req, res, next) {
	var code = req.params.code,
			email = req.session.uid;

  async.waterfall([
      function(callback) {
        models.client.findOne({
          where: {
            email: email
          }
        })
            .then(function(client) {
              callback(null, client);
            })
      },
      function(client, callback) {
        models.wishlist.create({
          productCode: code,
          clientId: client.clientId
        })
            .then(function() {
              callback();
            })
            .catch(function(err) {
              callback(err);
            });
      }
  ], function(err) {
    if(err instanceof models.sequelize.ValidationError) {
      return next(new HttpError(403, 'This item is already added'));
    }
    if(err) {
      console.log(err);
      return next(err);
    }
    res.send('Successfully added to wishlist');
  });
};

exports.removeFromWishlist = function(req, res, next) {
	var code = req.params.code;

  models.wishlist.destroy({
    where: {
      productCode: code
    }
  })
      .then(function() {
        res.send('/wishlist');
      })
      .catch(function(err) {
        next(err);
      });
};

exports.addToBasket = function(req, res, next) {
	var code = req.params.code,
			qty = +req.body.qty,
			i,
			basket;

	if(!req.session.basket) req.session.basket = [];

	if(!req.session.qty) req.session.qty = 0;

	basket = req.session.basket;
	if(!basket.length) {
		req.session.basket.push({code: code, qty: qty});
		req.session.qty += qty;
	} else { // checking if there is product with the same code in the basket
		for(i = 0; i < basket.length; i++) {
			var item = basket[i];
			if(item.code === code) {
				item.qty += qty;
				req.session.qty += qty;
				return res.end('Product successfully added to basket')
			} 
		}
		req.session.basket.push({code: code, qty: qty});
		req.session.qty += qty;
	}	
	res.end('Product successfully added to basket');
};

exports.removeFromBasket = function(req, res, next) {
	var code = req.params.code,
			basket = req.session.basket,
			i,
			len = basket.length;

	for(i = 0; i < len; i++) {
		var item = basket[i];
		if(item.code === code) {
			delete item.code;
			req.session.qty -= item.qty;
		}
	}		

	res.end();
};

exports.addReview = function(req, res, next) {
	var name = req.body.name,
			rate = req.body.rate,
			review = req.body.review,
			code = req.params.code;

	if(!validator.isNonEmpty(name)) {
		return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
	}	

	if(!validator.isInt(rate)) {
		return res.status(403).json(new HttpError(403, 'Rate should be a number'));
	}	

	if(!validator.isNonEmpty(review)) {
		return res.status(403).json(new HttpError(403, 'Review should be filled'));
	}		

	Review.save({
		name: name,
		rate: rate,
		review: review,
		code: code
	}, function(err) {
		if(err) return next(err);
		res.redirect('back');
	});			
};