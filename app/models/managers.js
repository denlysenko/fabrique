'use strict';

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var Manager = sequelize.define('manager', {
        login: {
          type: DataTypes.STRING(50),
          primaryKey: true,
          unique: {
            msg: 'Login already exists!'
          },
          validate: {
            notEmpty: {
              msg: 'Login should be filled!'
            }
          }
        },
        salt: {
          type: DataTypes.STRING(50)
        },
        hashedPassword: {
          type: DataTypes.STRING(50)
        },
        password: {
          type: DataTypes.VIRTUAL
        }
      },
      {
        classMethods: {
          encryptPassword: function(password, salt) {
            return crypto.createHmac('sha1', salt).update(password).digest('hex');
          }
        },
        instanceMethods: {
          checkPassword: function(password) {
            return this.hashedPassword === Manager.encryptPassword(password, this.salt);
          }
        },
        timestamps: true,
        underscored: false,
        tableName: 'managers'
      });

  Manager.beforeCreate(function(manager) {
    manager.salt = crypto.randomBytes(16).toString('hex');
    manager.hashedPassword = this.encryptPassword(manager.password, manager.salt);
  });

  Manager.beforeUpdate(function(manager) {
    if(manager.password) {
      manager.salt = crypto.randomBytes(16).toString('hex');
      manager.hashedPassword = this.encryptPassword(manager.password, manager.salt);
    }
  });

  return Manager;
};

