'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale',
      {
        id: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        code: {
          type: DataTypes.STRING(45),
          validate: {
            isAlphanumeric: {
              msg: 'Code should contain only letter or numbers'
            }
          }
        },
        title: {
          type: DataTypes.STRING(100),
          validate: {
            notEmpty: {
              msg: 'Title should contain letters and numbers'
            }
          }
        },
        oldPrice: {
          type: DataTypes.DECIMAL(8,2).UNSIGNED,
          validate: {
            isFloat: {
              msg: 'Price should contain decimal numbers'
            }
          }
        },
        newPrice: {
          type: DataTypes.DECIMAL(8,2).UNSIGNED,
          validate: {
            isFloat: {
              msg: 'Price should contain decimal numbers'
            }
          }
        },
        discount: {
          type: DataTypes.INTEGER(3).UNSIGNED,
          validate: {
            max: {
              args: ['99'],
              msg: 'Discount should be in the range 1 - 99'
            },
            min: {
              args: ['0'],
              msg: 'Discount should be in the range 1 - 99'
            }
          }
        }
      },
      {
        timestamps: true,
        underscored: true,
        tableName: 'sale'
      });
};