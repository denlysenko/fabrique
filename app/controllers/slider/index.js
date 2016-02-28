'use strict';

var models = require('../../models'),
    HttpError = require('../../lib/modules/errors').HttpError,
    validator = require('validator');

exports.showSearchForm = function(req, res) {
  res.render('api/products/search', {
    title: 'Search Products',
    page: 'slider',
    manager: req.session.manager
  });
};

exports.showProduct = function(req, res, next) {
  models.product.findOne({
    where: {
      productCode: req.params.code
    },
    include: [
      {model: models.image, as: 'images'}
    ]
  })
      .then(function(product) {
        if(!product) return next(new HttpError(404, 'Product Not Found'));
        res.render('api/products/slider', {
          title: 'Add ' + product.title + ' To Slider',
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
      slogan = req.body.slogan,
      image = req.body.image;

  if(!validator.isAlphanumeric(code)) {
    res.error('Code should contain only letter or numbers');
    res.redirect('back');
    return;
  }

  if(!image) {
    res.error('Please, choose image');
    res.redirect('back');
    return;
  }

  models.slider.create({
    title: title,
    slogan: slogan,
    imageUrl: image,
    productCode: code
  })
      .then(function() {
        res.message('Product with code ' + code + ' successfully added to slider');
        res.redirect('back');
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.showRemoveForm = function(req, res, next) {
  models.slider.findAll()
      .then(function(rows) {
        res.render('api/products/slider_remove', {
          title: 'Remove From Slider',
          results: rows
        });
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.removeFromSlider = function(req, res, next) {
  var id = req.params.id;

  models.slider.destroy({
    where: {
      id: id
    }
  })
      .then(function() {
        res.end();
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};