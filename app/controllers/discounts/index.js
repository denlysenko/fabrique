'use strict';

var models = require('../../models'),
    ValidationError = require('sequelize').ValidationError,
    async = require('async');

exports.index = function(req, res) {
  res.render('api/discounts', {
    title: 'Discount Cards',
    manager: req.session.manager
  });
};

exports.add = function(req, res, next) {
  var number = +req.body.number,
      discount = +req.body.discount;

  models.discountCard.create({
    cardNumber: number,
    discount: discount
  })
      .then(function(card) {
        res.message('Card with number ' + card.cardNumber + ' successfully added!', 'bg-success');
        res.redirect('back');
      })
      .catch(function(err) {
        if(err instanceof ValidationError) {
          res.error(err.message, 'bg-danger');
          res.redirect('back');
        } else {
          console.log(err);
          next(err);
        }
      });
};

exports.remove = function(req, res, next) {
  var number = +req.body.number;

  async.waterfall([
      function(callback) {
        models.discountCard.findOne({
          where: {
            cardNumber: number
          }
        })
            .then(function(card) {
              if(!card) {
                res.error('Card with number ' + number + ' does not exist');
                return res.redirect('back');
              }
              callback(null, card);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(card, callback) {
        card.destroy()
            .then(function(card) {
              callback(null, card);
            })
            .catch(function(err) {
              callback(err);
            });
      }
  ], function(err, card) {
    if(err) {
      console.log(err);
      next(err);
    }
    res.message('Card with number ' + card.cardNumber + ' successfully removed');
    res.redirect('back');
  });
};