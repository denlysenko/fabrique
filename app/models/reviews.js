'use strict';

module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define('review',
      {
        name: {
          type: DataTypes.STRING(90),
          validate: {
            notEmpty: {
              msg: 'Please, enter your name!'
            }
          }
        },
        rate: {
          type: DataTypes.INTEGER(3).UNSIGNED,
          validate: {
            isInt: {
              msg: 'Rate should be a number'
            }
          }
        },
        review: {
          type: DataTypes.TEXT,
          validate: {
            notEmpty: {
              msg: 'Review should be filled'
            }
          }
        }
      },
      {
        timestamps: true,
        underscored: false,
        tableName: 'reviews'
      });
  return Review;
};
