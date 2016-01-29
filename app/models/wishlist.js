'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wishlist',
      {
        code: {
          type: DataTypes.STRING(45),
          unique: {
            msg: 'This item was already added to your wishlist'
          }
        },
        email: {
          type: DataTypes.STRING(90)
        }
      },
      {
        timestamps: true,
        underscored: true,
        tableName: 'wishlists'
      });
};