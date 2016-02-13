'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('discountCard',
      {
        cardNumber: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          unique: {
            msg: 'Card number already exists'
          },
          validate: {
            is: {
              args: /\d{8}/,
              msg: 'Card number must contain 8 digits'
            }
          }
        },
        discount: {
          type: DataTypes.INTEGER(3).UNSIGNED,
          validate: {
            isInt: {
              msg: 'Discount must be an integer'
            }
          }
        }
      },
      {
        timestamps: false,
        underscored: false,
        tableName: 'discount_cards'
      });
};