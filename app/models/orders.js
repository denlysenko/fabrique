'use strict';

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('order',
      {
        id: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING(90)
        },
        title: {
          type: DataTypes.STRING(100)
        },
        qty: {
          type: DataTypes.INTEGER(4)
        },
        price: {
          type: DataTypes.DECIMAL(8,2)
        },
        currency: {
          type: DataTypes.STRING(1)
        },
        date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      },
      {
        classMethods: {
          associate: function(models) {}
        },
        timestamps: true,
        underscored: true,
        tableName: 'orders'
      });

  return Order;
};