'use strict';

var models = require('../../models'),
    async = require('async'),
    image = require('../../lib/modules/images');

exports.addProduct = function(req, res) {
  res.render('api/products/add', {
    title: 'Add Product',
    manager: req.session.manager
  });
};

exports.saveProduct = function(req, res, next) {
  var code = req.body.code && req.body.code.trim(),
      category = req.body.category,
      title = req.body.title,
      desc = req.body.description,
      info = req.body.info,
      price = req.body.price,
      feature = req.body.feature,
      characteristic = req.body.characteristic,
      dataSheet = [],
      images = [],
      newProduct;

  if(!req.files.photo) {
    res.error('Please, choose photos', 'bg-danger');
    return res.redirect('back');
  }

  return models.sequelize.transaction(function(t) {
    return models.product.create({
      productCode: code,
      category: category,
      title: title,
      desc: desc,
      info: info,
      price: price
    }, {transaction: t})
        .then(function(product) {
          newProduct = product;
          if(typeof feature === 'string') {
            dataSheet.push({
              productCode: product.productCode,
              feature: feature,
              characteristic: characteristic
            });
          } else {
            for(var i = 0; i < feature.length; i++) {
              dataSheet.push({
                productCode: product.productCode,
                feature: feature[i],
                characteristic: characteristic[i]
              });
            }
          }
          return models.dataSheet.bulkCreate(dataSheet, {validate: true, transaction: t})
              .then(function() {
                if(Array.isArray(req.files.photo)) {
                  images = [];
                  async.eachSeries(req.files.photo, function(photo, callback) {
                    if(photo.mimetype.indexOf('jpeg') === -1 && photo.mimetype.indexOf('png') === -1) {
                      res.error('Image should be in JPEG or PNG format');
                      return res.redirect('back');
                    }

                    image.load(photo.path, function(err, results) {
                      if(err && err.status === 400) {
                        res.error('Image already exists');
                        return res.redirect('back');
                      }

                      if(err) {
                        callback(err);
                      }

                      images.push({
                        productCode: newProduct.productCode,
                        imageUrl: results[0],
                        thumbUrl: results[1]
                      });
                      callback();
                    });
                  }, function(err) {
                    if (err) {
                      return next(err);
                    }
                    models.image.bulkCreate(images);
                  });

                } else {
                  if(req.files.photo.mimetype.indexOf('jpeg') ===  -1 && req.files.photo.mimetype.indexOf('png') === -1) {
                    res.error('Image should be in JPEG, JPG or PNG format');
                    return res.redirect('back');
                  }

                  image.load(req.files.photo.path, function(err, results) {
                    if(err && err.status === 400) {
                      res.error('Image already exists');
                      return res.redirect('back');
                    }

                    if(err) {
                      return next(err);
                    }

                    images.push({
                      productCode: newProduct.productCode,
                      imageUrl: results[0],
                      thumbUrl: results[1]
                    });

                    models.image.bulkCreate(images);
                  });
                }
              });
        });
  })
      .then(function() {
        res.message('Product with code ' + newProduct.productCode + ' successfully added', 'bg-success');
        res.redirect('back');
      })
      .catch(function(err) {
        if(err instanceof models.sequelize.ValidationError) {
          res.error(err.message);
          return res.redirect('back');
        }

        if(err) {
          console.log(err);
          next(err);
        }
      });
};

exports.showSearchForm = function(req, res) {
  res.render('api/products/search', {
    title: 'Edit Product',
    manager: req.session.manager,
    page: 'edit'
  });
};

exports.searchProduct = function(req, res, next) {
  var query = require('url').parse(req.url).query;
  var parts = query.split('=');

  if(parts[0] === 'category') {
    models.product.findAll({
      where: {
        category: parts[1].toLowerCase()
      }
    })
        .then(function(products) {
          if(!products.length) {
            res.error('Products not found');
            return res.redirect('back');
          }

          res.result(products);
          res.redirect('back');
        })
        .catch(function(err) {
          next(err);
        });
  } else if(parts[0] === 'code') {
    models.product.findAll({
      where: {
        productCode: parts[1].toLowerCase()
      }
    })
        .then(function(products) {
          if(!products.length) {
            res.error('Products not found');
            return res.redirect('back');
          }

          res.result(products);
          res.redirect('back');
        })
        .catch(function(err) {
          next(err);
        });
  } else if(parts[0] === 'title') {
    models.product.findAll({
      where: {
        title: parts[1].toLowerCase()
      }
    })
        .then(function(products) {
          if(!products.length) {
            res.error('Products not found');
            return res.redirect('back');
          }

          res.result(products);
          res.redirect('back');
        })
        .catch(function(err) {
          next(err);
        });
  }
};

exports.showProduct = function(req, res, next) {
  var code = req.params.code;

  models.product.findOne({
    where: {
      productCode: code
    },
    include: [
      {model: models.dataSheet, as: 'dataSheet'},
      {model: models.image, as: 'images'}
    ]
  })
      .then(function(product) {
        if(!product) return next(new HttpError(404, 'Product Not Found'));
        res.render('api/products/edit', {
          title: 'Edit ' + product.title,
          product: product
        });
      })
      .catch(function(err) {
        next(err);
      });
};

exports.removeImage = function(req, res, next) {
  async.waterfall([
      function(callback) {
        models.image.findById(req.params.id)
            .then(function(image) {
              callback(null, image);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(image, callback) {
        image.destroy()
            .then(function(image) {
              callback(null, image);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(image, callback) {
        image.remove({
          imageUrl: image.imageUrl,
          thumbUrl: image.thumbUrl
        }, callback);
      }
  ], function(err) {
    if(err) {
      console.log(err);
      return next(err);
    }
    res.message('Image successfully removed', 'bg-success');
    res.end();
  });
};

exports.removeDataSheet = function(req, res, next) {
  models.dataSheet.destroy({
    where: {
      id: req.params.id
    }
  })
      .then(function() {
        res.message('Feature successfully removed', 'bg-success');
        res.end();
      })
      .catch(function(err) {
        next(err);
      });
};