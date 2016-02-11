'use strict';

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define('client', {
    clientId: {
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
    password: {
      type: DataTypes.VIRTUAL
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
      associate: function(models) {
        Client.hasMany(models.order, {foreignKey: 'clientId', as: 'orders'});
        Client.hasMany(models.wishlist, {foreignKey: 'clientId', as: 'wishlist'});
      }
    },
    instanceMethods: {
      checkPassword: function(password) {
        return this.hashedPassword === Client.encryptPassword(password, this.salt);
      }
    },
    timestamps: true,
    underscored: false,
    tableName: 'clients'
  });

  Client.beforeCreate(function(client) {
    client.salt = crypto.randomBytes(16).toString('hex');
    client.hashedPassword = this.encryptPassword(client.password, client.salt);
  });

  Client.beforeUpdate(function(client) {
    client.salt = crypto.randomBytes(16).toString('hex');
    client.hashedPassword = this.encryptPassword(client.password, client.salt);
  });

  return Client;
};

