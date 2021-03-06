'use strict';

var models = require('../../models'),
    async = require('async'),
    Image = require('../../lib/modules/images'),
    _ = require('lodash'),
    HttpError = require('../../lib/modules/errors').HttpError;

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
              productCode: newProduct.productCode,
              feature: feature,
              characteristic: characteristic
            });
          } else {
            for(var i = 0; i < feature.length; i++) {
              dataSheet.push({
                productCode: newProduct.productCode,
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

                    Image.load(photo.path, function(err, results) {
                      if(err && err.status === 400) {
                        res.error('Image already exists');
                        return res.redirect('back');
                      }

                      if(err) {
                        return callback(err);
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

                  Image.load(req.files.photo.path, function(err, results) {
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
          product: product,
          manager: req.session.manager
        });
      })
      .catch(function(err) {
        next(err);
      });
};

exports.updateProduct = function(req, res, next) {
  var updatedProduct;
  return models.sequelize.transaction(function(t) {
    return models.product.findOne({
      where: {
        productCode: req.params.code
      }
    }, {transaction: t})
        .then(function(product) {
          updatedProduct = product;
          _.extend(product, req.body.product);
          return product.save({transaction: t})
              .then(function(product) {
                if(req.body.feature) {
                  var dataSheet = [];
                  if(typeof req.body.feature === 'string') {
                    dataSheet.push({
                      productCode: product.productCode,
                      feature: req.body.feature,
                      characteristic: req.body.characteristic
                    });
                  } else {
                    for(var i = 0; i < req.body.feature.length; i++) {
                      dataSheet.push({
                        productCode: product.productCode,
                        feature: req.body.feature[i],
                        characteristic: req.body.characteristic[i]
                      });
                    }
                  }
                  return models.dataSheet.bulkCreate(dataSheet, {validate: true, transaction: t})
                }

              })
        })
  }).then(function() {
    if(req.files.photo) {
      var images = [];
      if(Array.isArray(req.files.photo)) {
        async.eachSeries(req.files.photo, function(photo, callback) {
          if(photo.mimetype.indexOf('jpeg') === -1 && photo.mimetype.indexOf('png') === -1) {
            res.error('Image should be in JPEG or PNG format');
            return res.redirect('back');
          }

          Image.load(photo.path, function(err, results) {
            if(err && err.status === 400) {
              res.error('Image already exists');
              return res.redirect('back');
            }

            if(err) {
              callback(err);
            }

            images.push({
              productCode: updatedProduct.productCode,
              imageUrl: results[0],
              thumbUrl: results[1]
            });
            callback();
          });
        }, function(err) {
          if (err) {
            console.log(err);
            return next(err);
          }
          models.image.bulkCreate(images)
              .then(function() {
                res.message('Product with code ' + updatedProduct.productCode + ' successfully updated', 'bg-success');
                res.redirect('back');
              })
              .catch(function(err) {
                console.log(err);
                next(err);
              });
        });

      } else {
        if(req.files.photo.mimetype.indexOf('jpeg') ===  -1 && req.files.photo.mimetype.indexOf('png') === -1) {
          res.error('Image should be in JPEG, JPG or PNG format');
          return res.redirect('back');
        }

        Image.load(req.files.photo.path, function(err, results) {
          if(err && err.status === 400) {
            res.error('Image already exists');
            return res.redirect('back');
          }

          if(err) {
            console.log(err);
            return next(err);
          }

          images.push({
            productCode: updatedProduct.productCode,
            imageUrl: results[0],
            thumbUrl: results[1]
          });

          models.image.bulkCreate(images)
              .then(function() {
                res.message('Product with code ' + updatedProduct.productCode + ' successfully updated', 'bg-success');
                res.redirect('back');
              })
              .catch(function(err) {
                console.log(err);
                next(err);
              });
        });
      }
    } else {
      res.message('Product with code ' + updatedProduct.productCode + ' successfully updated', 'bg-success');
      res.redirect('back');
    }
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
            .then(function() {
              callback(null, image);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(image, callback) {
        Image.remove({
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

exports.removeProduct = function(req, res, next) {
  var code = req.params.code;
  async.series([
    function(callback) {
      return models.dataSheet.destroy({
        where: {
          productCode: code
        }
      })
          .then(function() {
            callback();
          })
          //.catch(function(err) {
          //  callback(err);
          //});
    },
    function(callback) {
      return  models.image.findAll({
        where: {
          productCode: code
        }
      })
          .then(function(images) {
            callback(null, images);
          })
          .catch(function(err) {
            callback(err);
          });
    },
    function(callback) {
      return models.image.destroy({
        where: {
          productCode: code
        }
      })
          .then(function() {
            callback();
          })
          //.catch(function(err) {
          //  callback(err);
          //})
    },
    function(callback) {
      return models.sale.destroy({
        where: {
          productCode: code
        }
      })
          .then(function() {
            callback();
          })
          //.catch(function(err) {
          //  callback(err);
          //})
    },
    function(callback) {
      return models.slider.destroy({
        where: {
          productCode: code
        }
      })
          .then(function() {
            callback();
          })
          //.catch(function(err) {
          //  callback(err);
          //});
    },
    function(callback) {
      return models.product.destroy({
        where: {
          productCode: code
        }
      })
          .then(function() {
            callback();
          })
          .catch(function(err) {
            callback(err);
          })
    }
  ], function(err, results) {
    if(err) {
      console.log(err);
      return next(err);
    }

    if(results[1].length) {
      async.each(results[1], function(item, done) {
        Image.remove({
          imageUrl: item.imageUrl,
          thumbUrl: item.thumbUrl
        }, done)
      }, function(err) {
          if(err) {
            console.log(err);
            return next(err);
          }
          res.message('Product with code ' + code + ' successfully removed', 'bg-success');
          res.send('/api/products/edit');
        });

    } else {
      res.message('Product with code ' + code + ' successfully removed', 'bg-success');
      res.send('/api/products/edit');
    }
  });
};