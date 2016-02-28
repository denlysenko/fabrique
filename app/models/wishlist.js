'use strict';

module.exports = function(sequelize, DataTypes) {
  var Wishlist = sequelize.define('wishlist',
      {
        productCode: {
          type: DataTypes.STRING(45),
          unique: {
            msg: 'This item was already added to your wishlist'
          }
        }
      },
      {
        classMethods: {
          associate: function(models) {
            Wishlist.belongsTo(models.product, {foreignKey: 'productCode'});
          }
        },
        timestamps: false,
        underscored: false,
        tableName: 'wishlists'
      });

  return Wishlist;
};