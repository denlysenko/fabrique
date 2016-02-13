'use strict';

var models = require('../../models'),
    validator = require('validator'),
    ValidationError = require('sequelize').ValidationError,
    async = require('async');

exports.index = function(req, res) {
  if(req.session.manager) {
    res.render('api/index', {
      title: 'Admin Panel'
    });
  } else {
    res.render('api/authentication', {
      title: 'Authentication'
    });
  }
};

exports.cancel = function(req, res) {
  res.redirect('/');
};

exports.authenticate = function(req, res, next) {
  var login = req.body.login;
  var password = req.body.passwd;

  if(!validator.isAlphanumeric(login)) {
    res.error('Login should contain only letter or numbers');
    return res.redirect('back');
  }

  if(!validator.isAlphanumeric(password)) {
    res.error('Password should contain only letter or numbers');
    return res.redirect('back');
  }

  login = login.trim();
  password = password.trim();

  models.manager.findOne({
    where: {
      login: login
    }
  })
      .then(function(manager) {

        if(!manager) {
          res.error('User ' + login + ' not found');
          return res.redirect('back');
        }

        if(!manager.checkPassword(password)) {
          res.error('Invalid password');
          return res.redirect('back');
        }

        req.session.manager = login;
        res.render('api/index', {
          title: 'Admin Panel',
          manager: login
        });
      })
      .catch(function(err) {
        console.log(err);
        next(err);
      });
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.manager = function(req, res) {
  res.render('api/manager', {
    title: 'Managers',
    manager: req.session.manager
  });
};

exports.create = function(req, res, next) {
  var login = req.body.name;
  var password = req.body.passwd;

  if(!validator.isAlphanumeric(login)) {
    res.error('Login should contain only letter or numbers');
    return res.redirect('back');
  }

  if(!validator.isAlphanumeric(password)) {
    res.error('Password should contain only letter or numbers');
    return res.redirect('back');
  }

  login = login.trim();
  password = password.trim();

  models.manager.create({
    login: login,
    password: password
  })
      .then(function() {
        res.message(login + ' successfully saved', 'bg-success');
        res.redirect('back');
      })
      .catch(function(err) {
        if(err instanceof ValidationError) {
          res.error(err.message);
          res.redirect('back');
        } else {
          console.log(err);
          next(err);
        }
      });
};

exports.update = function(req, res, next) {
  var login = req.session.manager;
  var password = req.body.passwd && req.body.passwd.trim();

  if(password) {
    async.waterfall([
      function(callback) {
        models.manager.findOne({
          where: {
            login: login
          }
        })
            .then(function(manager) {
              if(!manager) {
                res.error(login + ' not found');
                return res.redirect('back');
              }

              if(password) manager.password = password;
              callback(null, manager);
            })
            .catch(function(err) {
              callback(err);
            })
      },
      function(manager, callback) {

        manager.save()
            .then(function(manager) {
              callback(null, manager);
            })
            .catch(function(err) {
              callback(err);
            });
      }
    ], function(err, manager) {
      if(err && err instanceof ValidationError) {
        res.error(name + ' already exists');
        return res.redirect('back');
      }

      if(err) {
        console.log(err);
        return next(err);
      }

      res.message(manager.login + ' successfully saved', 'bg-success');
      return res.redirect('back');
    });
  }
};

exports.remove = function(req, res, next) {
  var login = req.body.name;

  if(!validator.isAlphanumeric(login)) {
    res.error('Login should contain only letter or numbers');
    return res.redirect('back');
  }

  login = login.trim();

  async.waterfall([
      function(callback) {
        models.manager.findOne({
          where: {
            login: login
          }
        })
            .then(function(manager) {
              if(!manager) {
                res.error(login + ' not found');
                return res.redirect('back');
              }

              callback(null, manager);
            })
            .catch(function(err) {
              callback(err);
            });
      },
      function(manager, callback) {
        manager.destroy()
            .then(function() {
              callback(null, manager);
            })
            .catch(function(err) {
              callback(err);
            })
      }
  ], function(err, manager) {
    if(err) {
      console.log(err);
      return next(err);
    }
    res.message(manager.login + ' successfully removed', 'bg-success');
    res.redirect('back');
  });
};



