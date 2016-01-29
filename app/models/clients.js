'use strict';

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define('client', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(90),
      validate: {
        notEmpty: {
          msg: 'Name should be filled!'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(90),
      validate: {
        notEmpty: {
          msg: 'Last Name should be filled!'
        }
      }
    },
    email: {
      type: DataTypes.STRING(90),
      unique: {
        msg: 'Email already exists!'
      },
      validate: {
        notEmpty: {
          msg: 'Email should be filled!'
        },
        isEmail: {
          msg: 'Please, enter valid email!'
        }
      }
    },
    salt: {
      type: DataTypes.STRING(45)
    },
    hashedPassword: {
      type: DataTypes.STRING(90)
    },
    verified: {
      type: DataTypes.INTEGER(4).UNSIGNED,
      defaultValue: 0
    }
  },
  {
    classMethods: {
      encryptPassword: function(password, salt) {
        return crypto.createHmac('sha1', salt).update(password).digest('hex');
      },
      associate: function(models) {}
    },
    instanceMethods: {
      checkPassword: function(password, salt, hashedPassword) {
        return hashedPassword === this.encryptPassword(password, salt);
      }
    },
    timestamps: true,
    underscored: true,
    tableName: 'clients'
  });

  Client.beforeCreate(function(client) {
    client.salt = crypto.randomBytes(16).toString('hex');
    client.hashedPassword = this.encryptPassword(client.password, client.salt);
  });

  return Client;
};

