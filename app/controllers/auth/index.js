var generatePassword = require('password-generator'),
    models = require('../../models'),
    ValidationError = require('sequelize').ValidationError,
    HttpError = require('../../lib/modules/errors').HttpError,
		verifyEmail = require('../../lib/modules/email-verification'),
    async = require('async'),
    validator = require('validator'),
    moment = require('moment');

validator.extend('isNonEmpty', function(str) {
  return str !== '';
});

exports.regForm = function(req, res) {
  res.render('register', {
    title: 'Register',
    page: req.path
  });
};

exports.securePassword = function(req, res) {
  var password = generatePassword(12, false);
  res.send(password);
};

exports.register = function(req, res, next) {
  var name = req.body.name && req.body.name.trim(),
      lastName = req.body['last-name'] && req.body['last-name'].trim(),
      email = req.body.email && req.body.email.trim(),
      password = req.body.passwd && req.body.passwd.trim(),
      subscription = req.body.subscription;

  async.series([
      function(callback) {
        models.client.create({
          name: name,
          lastName: lastName,
          email: email,
          password: password
        })
            .then(function() {
              callback();
            })
            .catch(function(err) {
              if (err instanceof ValidationError) {
                return callback(new HttpError(403, err.message));
              } else {
                return callback(err);
              }
            });
      },
      function(callback) {
        var link = req.protocol + '://' + req.get('host') + req.originalUrl;
        verifyEmail.sendVerifyEmail(email, link, function(err) {
          if (err) return next(err);
          if (subscription) {
            models.subscriber.create({
              email: email
            })
                .then(function () {
                  callback();
                })
                .catch(function (err) {
                  if (err instanceof ValidationError) {
                    return callback(new HttpError(403, err.message));
                  } else {
                    return callback(err);
                  }
                });
          } else {
            callback();
          }
        });
      }
  ], function(err) {
    if(err && err.status === 403) return res.status(403).send({message: err.message});
    if(err) {
      console.log(err);
      return next(err);
    }
    res.send('We sent verification letter on your email. Please, confirm your email. Link valid 1 hour');
  });
};

exports.confirmation = function(req, res, next) {
  var token = req.params.token;
  verifyEmail.confirm(token, function(err) {
    if(err) {
      console.log(err);
      return next(err);
    }
    res.message('Your Email has been activated. Please, log in.', 'bg-success');
    res.redirect('/login');
  });
};

exports.login = function(req, res, next) {
  res.render('login', {
    title: 'Log In',
    page: req.path
  });
};

exports.authenticate = function(req, res, next) {
  var email = req.body.email,
      password = req.body.passwd;

  if(!validator.isEmail(email)) {
    return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
  }

  if(!validator.isNonEmpty(password)) {
    return res.status(403).json(new HttpError(403, 'Password should be filled'));
  }

  email = email.trim();
  password = password.trim();

  models.client.findOne({
    where: {email: email, verified: 1}
  })
      .then(function(client) {
        if(!client) return res.status(404).send({message: 'User Not Found'});
        if(!client.checkPassword(password)) return res.status(403).send(new HttpError(403, 'Invalid password'));
        req.session.uid = email;
        res.send('User ' + email + ' successfully logged in');
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.restore = function(req, res, next) {
  var email = req.body.email && req.body.email.trim();
  models.client.findOne({
    where: {email: email, verified: 1}
  })
      .then(function(client) {
        if(!client) return next(new HttpError(404, 'User Not Found'));
        res.render('restore', {
          title: 'Restore password',
          page: req.path,
          email: client.email
        });
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.updatePassword = function(req, res, next) {
  var email = req.body.email,
      password = req.body.passwd;

  if(!validator.isEmail(email)) {
    return res.status(403).json(new HttpError(403, 'Please, enter valid email'));
  }

  if(!validator.isNonEmpty(password)) {
    return res.status(403).json(new HttpError(403, 'Password should be filled'));
  }

  email = email.trim();
  password = password.trim();

  async.waterfall([
      function(callback) {
        models.client.findOne({
          where: {email: email, verified: 1}
        })
            .then(function(client) {
              callback(null, client);
            })
            .catch(function(err) {
              console.log(err);
              next(err);
            })
      },
      function(client, callback) {
        client.password = password;
        client.save()
            .then(function(client) {
              callback();
            })
            .catch(function(err) {
              if(err instanceof ValidationError) {
                callback(new HttpError(403, err.message));
              } else {
                callback(err);
              }
            })
      }
  ], function(err) {
    if(err && err.status === 403) return res.status(403).send({message: err.message});
    if(err) {
      console.log(err);
      return next(err);
    }
    res.send('Password successfully changed');
  });

};

exports.subscription = function(req, res, next) {
  res.render('subscription', {
    title: 'Newsletter Subscription',
    page: req.path
  });
};

exports.subscribe = function(req, res, next) {
  var email = req.body.email;

  if(!validator.isNonEmpty(email)) {
    return res.status(403).json(new HttpError(403, 'Please, enter email'));
  }

  models.subscriber.create({
    email: email
  })
      .then(function() {
        res.send('You successfully subscribed to newsletter');
      })
      .catch(function(err) {
        if(err instanceof ValidationError) {
          res.status(403).json(new HttpError(403, 'You have already subscribed'));
        } else {
          next(err);
        }
      });
};

exports.getHistory = function(req, res, next) {
  var email = req.session.uid;

  async.waterfall([
      function(callback) {
        models.client.findOne({
          where: {
            email: email
          },
          attributes: ['clientId']
        })
            .then(function(client) {
              callback(null, client.clientId);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(clientId, callback) {
        models.order.findAll({
          where: {
            clientId: clientId
          }
        })
            .then(function(orders) {
              callback(null, orders);
            })
            .catch(function(err) {
              callback(err);
            });
      }
  ], function(err, orders) {
    if(err) {
      console.log(err);
      return next(err);
    }
    res.render('orders', {
      title: 'Your order history',
      orders: orders,
      page: req.path,
      moment: moment
    });
  });
};

exports.cancelAccount = function(req, res, next) {
  res.render('confirmation', {
    title: 'Confirmation Deletion'
  });
};

exports.removeAccount = function(req, res, next) {
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
      models.client.destroy({
        where: {
          clientId: client.clientId
        }
      })
          .then(function() {
            callback(null, client.clientId);
          })
          .catch(function(err) {
            callback(err);
          });
    },
    function(clientId, callback) {
      models.order.destroy({
        where: {
          clientId: clientId
        }
      })
          .then(function() {
            callback(null, clientId);
          })
          .catch(function(err) {
            callback(err);
          })
    },
    function(clientId, callback) {
      models.wishlist.destroy({
        where: {
          clientId: clientId
        }
      })
          .then(function() {
            callback();
          })
          .catch(function(err) {
            callback(err);
          });
    },
    function(callback) {
      models.subscriber.destroy({
        where: {
          email: email
        }
      })
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
    req.session.destroy();
    res.send('/');
  });
};

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
};
