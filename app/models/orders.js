'use strict';

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('order',
      {
        productTitle: {
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
        }
      },
      {
        classMethods: {
          associate: function(models) {}
        },
        timestamps: true,
        underscored: false,
        tableName: 'orders'
      });

  return Order;
};