'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('discount',
      {
        cardNumber: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          unique: {
            msg: 'Card number already exists'
          },
          validate: {
            is: {
              args: [['\d{8}']],
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
        timestamps: true,
        underscored: true,
        tableName: 'discounts'
      });
};