'use strict';

var models = require('../../models'),
    HttpError = require('../../lib/modules/errors').HttpError,
    validator = require('validator'),
    async = require('async');

exports.showSearchForm = function(req, res) {
  res.render('api/products/search', {
    title: 'Search Products',
    page: 'sale'
  });
};

exports.showProduct = function(req, res, next) {
  var code = req.params.code;

  models.product.findOne({
    where: {
      productCode: code
    }
  })
      .then(function(product) {
        //if(!product) return next(new HttpError(404, 'Product Not Found'));
        res.render('api/products/sale', {
          title: 'Add Product On Sale',
          product: product
        });
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.addProduct = function(req, res, next) {
  var code = req.body.code,
      title = req.body.title,
      price = req.body.price,
      discount = req.body.discount;

  var newPrice = (price - price*discount/100).toFixed(2);

  async.waterfall([
      function(callback) {
        models.sale.create({
          productCode: code,
          title: title,
          oldPrice: price,
          newPrice: newPrice,
          discount: discount
        })
            .then(function() {
              callback();
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(callback) {
        models.product.findOne({
          where: {
            productCode: code
          }
        })
            .then(function(product) {
              callback(null, product);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(product, callback) {
        product.update({price: newPrice, sale: discount})
            .then(function() {
              callback();
            })
            .catch(function(err) {
              callback(err);
            });
      }
  ], function(err) {
    if(err && err instanceof models.sequelize.ValidationError) {
      res.error('Product with ' + code + ' has been already added');
      res.redirect('/api/sale');
    }

    if(err) {
      console.log(err);
      next(err);
    }

    res.message('Product with code ' + code + ' successfully added on sale');
    res.redirect('back');
  });
};

exports.showRemoveForm = function(req, res, next) {
  models.sale.findAll()
      .then(function(rows) {
        res.render('api/products/sale_remove', {
          title: 'Remove From Sale',
          results: rows
        });
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.removeFromSale = function(req, res, next) {
  var id = req.params.id;
  async.waterfall([
    function(callback) {
      models.sale.findById(id)
          .then(function(sale) {
            if(!sale) callback(new HttpError(404, 'Product Not Found'));
            callback(null, sale);
          })
          .catch(function(err) {
            callback(err);
          });
    },
    function(sale, callback) {
      models.product.findOne({
        where: {
          productCode: sale.productCode
        }
      })
          .then(function(product) {
            callback(null, product, sale);
          })
          .catch(function(err) {
            callback(err);
          });
    },
    function(product, sale, callback) {
      product.update({price: sale.old_price, sale: null})
          .then(function() {
            callback(null, sale);
          })
          .catch(function(err) {
            callback(err);
          });
    },
    function(sale, callback) {
      sale.destroy()
          .then(function() {
            callback();
          })
          .catch(function(err) {
            callback(err);
          });
    }
  ], function(err) {
    if(err) {
      console.log(err);
      return next(err);
    }
    res.send('/api/sale_remove');
  });
};