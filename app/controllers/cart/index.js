var models = require('../../models'),
    validator = require('validator'),
    HttpError = require('../../lib/modules/errors').HttpError,
    config = require('../../../config'),
    nodemailer = require('nodemailer'),
    async = require('async');

validator.extend('isNonEmpty', function(str) {
  return str !== '';
});

var transporter = nodemailer.createTransport({
  service: config.get('mailer:service'),
  auth: config.get('mailer:auth')
});

exports.show = function(req, res, next) {
  if(req.session.basket && req.session.basket.length) {
    var basket = req.session.basket;
    var codes = [], i, len = basket.length;

    for(i = 0; i < len; i++) {
      var item = basket[i];
      codes.push(item.code);
    }

    models.product.findAll({
      where: {
        productCode: {
          $in: codes
        }
      },
      include: [
        {model: models.image, as: 'images'}
      ]
    })
        .then(function(rows) {
          rows.map(function(row) {
            for(i = 0; i < len; i++) {
              if(row.productCode === basket[i].code) {
                row.qty = basket[i].qty;
              }
            }
          });
          res.render('cart', {
            title: 'Your basket',
            products: rows,
            page: req.path
          });
        })
        .catch(function(err) {
          next(err);
        });
  } else {
    res.render('cart', {
      title: 'Your basket',
      products: null,
      page: req.path
    });
  }
};

exports.checkout = function(req, res) {
  res.render('partials/checkout');
};

exports.sendOrder = function(req, res, next) {
  var firstName = req.body.firstName,
      lastName = req.body.lastName,
      email = req.body.email,
      phone = req.body['tel-num'],
      payment = req.body.payment,
      address = req.body.address,
      code = req.body.code,
      title = req.body.title,
      price = req.body.price,
      currency = req.body.currency,
      qty = req.body.quantity,
      discount = req.body.discount || 'none',
      orders = [],
      products = [];

  if(!validator.isEmail(email)) return next(new HttpError(403, 'Incorrect Email'));
  if(!validator.matches(phone, /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)) return next(new HttpError(403, 'Incorrect phone number'));

  var client = {
    name: firstName,
    surname: lastName,
    email: email,
    phone: phone,
    payment: payment,
    address: address,
    discount: discount
  };

  async.waterfall([
      function(callback) {
        models.client.findOne({
          where: {
            email: email
          },
          attributes: [
              'clientId'
          ]
        })
            .then(function(client) {
              callback(null, client.clientId);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(clientId, callback) {
        if(Array.isArray(title)) {
          var i, len = title.length;
          for(i = 0; i < len; i++) {
            orders.push({
              clientId: clientId,
              productTitle: title[i],
              qty: +qty[i],
              price: +price[i],
              currency: currency[i]
            });
            products.push({code: code[i], title: title[i], price: price[i], currency: currency[i], qty: qty[i]});
          }
        } else {
          orders.push({
            clientId: clientId,
            productTitle: title,
            qty: +qty,
            price: +price,
            currency: currency
          });
          products.push({code: code, title: title, price: price, currency: currency, qty: qty});
        }
        models.order.bulkCreate(orders)
            .then(function() {
              callback();
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(callback) {
        res.render('emails/order', {client: client, products: products}, function(err, html) {
          if(err) return callback(err);
          transporter.sendMail({
            to: config.get('recipient:email'),
            from: '',
            subject: 'New Order',
            html: html
          }, callback);
        });
      }
  ], function(err) {
    if(err) {
      console.log(err);
      return next(err);
    }
    req.session.basket = [];
    req.session.qty = 0;
    res.message('Your order is accepted. Our manager will contact you!', 'bg-success');
    res.end();
  });
};

exports.checkDiscount = function(req, res, next) {
  var number = req.body.discount;

  models.discountCard.findOne({
    where: {
      cardNumber: number
    }
  })
      .then(function(card) {
        if(!card) {
          res.error('Card Not Found', 'bg-danger');
          return res.redirect('back');
        }
        res.message('Your discount is ' + card.discount + ' %', 'bg-success');
        res.redirect('back');
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.update = function(req, res, next) {
  var number = req.body.number;

  models.discountCard.findOne({
    where: {
      cardNumber: number
    }
  })
      .then(function(card) {
        if(!card) return next(new HttpError(404, 'Not Found'));
        res.end(card.discount.toString());
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};
